import { RootState, UserState } from "@/types/state";
import router from "../router";
import { ActionContext } from "vuex";
import { LoginResponse, User } from "@/types/user";
import UserService from "@/services/user";
import { Rlc } from "@/types/core";

const state = {
  token: null,
  key: null,
  user: null,
  rlc: null,
  permissions: [],
  admin: {
    profiles: 0,
    record_deletion_requests: 0,
    record_permit_requests: 0,
  },
};

const getters = {
  user: (state: UserState) => state.user,
  rlc: (state: UserState) => state.rlc,
  token: (state: UserState) => `Token ${state.token}`,
  key: (state: UserState) =>
    state.key ? state.key.replace(/(?:\r\n|\r|\n)/g, "<linebreak>") : "",
  isAuthenticated: (state: UserState) => !!state.token && !!state.key,
  loginData: () => JSON.parse(localStorage.getItem("loginData") || "null"),
  admin: (state: UserState) => state.admin,
  loaded: (state: UserState) =>
    !!state.token && !!state.key && !!state.user && !!state.rlc,
  adminNotifications: (state: UserState) =>
    state.admin
      ? state.admin.profiles +
        state.admin.record_deletion_requests +
        state.admin.record_permit_requests
      : 0,
};

const actions = {
  autoLogin(context: ActionContext<UserState, RootState>) {
    const loginData = context.getters.loginData;
    if (loginData && "token" in loginData && "key" in loginData) {
      // login already to avoid the login page flash
      context.commit("login", {
        token: loginData.token,
        key: loginData.key,
        user: null,
      });
      // now truly login if the token is not valid interceptors will redirect to login page anyway
      return UserService.statics(loginData.token)
        .then((statics) => {
          context.commit("login", {
            token: loginData.token,
            key: loginData.key,
            user: statics.user,
          });
          context.commit("setRlc", statics.rlc);
          context.commit("setPermissions", statics.permissions);
        })
        .catch((error) => {
          throw error.response.data;
        });
    }
    return;
  },
  login: (
    context: ActionContext<UserState, RootState>,
    data: LoginResponse,
  ) => {
    context.commit("login", data);
    context.commit("setRlc", data.rlc);
    context.commit("setPermissions", data.permissions);
  },
  logout: (context: ActionContext<UserState, RootState>) => {
    return new Promise<void>((resolve) => {
      context.commit("logout");
      router.push({ name: "user-login" });
      resolve();
    });
  },
  setAdmin: (
    context: ActionContext<UserState, RootState>,
    data: {
      profiles: number;
      record_deletion_requests: number;
      record_permit_requests: number;
    },
  ) => {
    context.commit("setAdmin", data);
  },
};

const mutations = {
  login: (
    state: UserState,
    data: { token: string; user: User; key: string },
  ) => {
    localStorage.setItem(
      "loginData",
      JSON.stringify({ token: data.token, key: data.key }),
    );
    state.token = data.token;
    state.user = data.user;
    state.key = data.key;
  },
  logout: (state: UserState) => {
    localStorage.removeItem("loginData");
    state.token = null;
    state.user = null;
    state.key = null;
    state.rlc = null;
    state.permissions = [];
    state.admin = {
      profiles: 0,
      record_deletion_requests: 0,
      record_permit_requests: 0,
    };
  },
  setRlc: (state: UserState, rlc: Rlc) => {
    state.rlc = rlc;
  },
  setPermissions: (state: UserState, permissions: string[]) => {
    state.permissions = permissions;
  },
  setAdmin: (
    state: UserState,
    notifications: {
      profiles: number;
      record_deletion_requests: number;
      record_permit_requests: number;
    },
  ) => {
    state.admin = notifications;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
