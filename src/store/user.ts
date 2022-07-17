import { RootState, UserState } from "@/types/state";
import router from "../router";
import { ActionContext } from "vuex";
import { LoginResponse, RefreshResponse, RlcUser } from "@/types/user";
import UserService from "@/services/user";
import { Rlc } from "@/types/core";

const state = {
  access: null,
  refresh: null,
  user: null,
  rlc: null,
  permissions: [],
  task: null,
  admin: {
    profiles: 0,
    record_deletion_requests: 0,
    record_permit_requests: 0,
  },
};

const getters = {
  // user
  user: (state: UserState) => state.user,
  // rlc
  rlc: (state: UserState) => state.rlc,
  // auth
  token: (state: UserState) => `Bearer ${state.access}`,
  access: (state: UserState) => state.access,
  refresh: (state: UserState) => state.refresh,
  isAuthenticated: (state: UserState) => !!state.access && !!state.refresh,
  loaded: (state: UserState) =>
    !!state.rlc && !!state.user && !!state.permissions,
  // admin
  admin: (state: UserState) => state.admin,
  adminNotifications: (state: UserState) =>
    state.admin
      ? state.admin.profiles +
        state.admin.record_deletion_requests +
        state.admin.record_permit_requests
      : 0,
};

const actions = {
  autoLogin(context: ActionContext<UserState, RootState>) {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (access && refresh) {
      // login already to avoid the login page flash
      context.commit("login", {
        access: access,
        refresh: refresh,
      });
      // refresh
      context.dispatch("refresh");
      context.dispatch("autoRefresh");
      // now truly login if the token is not valid interceptors will redirect to login page anyway
      return UserService.statics()
        .then((statics) => {
          context.commit("setUser", statics.user);
          context.commit("setRlc", statics.rlc);
          context.commit("setPermissions", statics.permissions);
        })
        .catch((error) => {
          context.commit("logout");
          throw error;
        });
    }
    return;
  },
  setUser(context: ActionContext<UserState, RootState>, user: RlcUser) {
    context.commit("setUser", user);
  },
  login: (
    context: ActionContext<UserState, RootState>,
    data: LoginResponse,
  ) => {
    context.commit("login", data);
    context.commit("setUser", data.user);
    context.commit("setRlc", data.rlc);
    context.commit("setPermissions", data.permissions);
    context.dispatch("autoRefresh");
  },
  autoRefresh: (context: ActionContext<UserState, RootState>) => {
    const task = setTimeout(() => {
      context.dispatch("refresh");
      context.dispatch("autoRefresh");
    }, 15 * 60 * 1000);
    context.commit("setTask", task);
  },
  refresh: (context: ActionContext<UserState, RootState>) => {
    return UserService.refresh({ refresh: context.getters.refresh }).then(
      (newToken) => {
        context.commit("refresh", newToken);
        return newToken;
      },
    );
  },
  logout: (context: ActionContext<UserState, RootState>) => {
    return new Promise<void>((resolve) => {
      context.commit("logout");
      context.commit("resetTask");
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
  login: (state: UserState, data: { access: string; refresh: string }) => {
    localStorage.setItem("access", data.access);
    state.access = data.access;
    localStorage.setItem("refresh", data.refresh);
    state.refresh = data.refresh;
  },
  refresh: (state: UserState, data: RefreshResponse) => {
    localStorage.setItem("access", data.access);
    state.access = data.access;
    localStorage.setItem("refresh", data.refresh);
    state.refresh = data.refresh;
  },
  setTask: (state: UserState, task: ReturnType<typeof setTimeout>) => {
    state.task = task;
  },
  resetTask: (state: UserState) => {
    if (state.task) clearTimeout(state.task);
    state.task = null;
  },
  logout: (state: UserState) => {
    localStorage.clear();
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    state.access = null;
    state.refresh = null;
    state.user = null;
    state.rlc = null;
    state.permissions = null;
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
  setUser: (state: UserState, user: RlcUser) => {
    state.user = user;
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
