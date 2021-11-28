import { RootState, UserState } from "@/types/state";
import router from "../router";
import { ActionContext } from "vuex";
import { User } from "@/types/user";
import UserService from "@/services/user";
import { Rlc } from "@/types/core";

const state = {
  token: null,
  key: null,
  user: null,
  rlc: null,
  permissions: [],
  notifications: 0,
  admin: null,
};

const getters = {
  user: (state: UserState) => state.user,
  rlc: (state: UserState) => state.rlc,
  permissions: (state: UserState) => state.permissions,
  token: (state: UserState) => `Token ${state.token}`,
  key: (state: UserState) =>
    state.key ? state.key.replace(/(?:\r\n|\r|\n)/g, "<linebreak>") : "",
  isAuthenticated: (state: UserState) => !!state.token && !!state.key,
  loginData: () => JSON.parse(localStorage.getItem("loginData") || "{}"),
  notifications: (state: UserState) => state.notifications,
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
    if ("token" in loginData && "key" in loginData) {
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
          // context.commit("setNotifications", statics.notifications);
          // context.commit('setAllPermissions', statics.all_permissions);
        })
        .catch((error) => {
          throw error.response.data;
        });
    }
    return;
  },
  login: (
    context: ActionContext<UserState, RootState>,
    data: { email: string; password: string; next?: string },
  ) => {
    return UserService.login(data).then((login) => {
      context.commit("login", login);
      context.commit("setRlc", login.rlc);
      context.commit("setPermissions", login.permissions);
    });
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
  //   register: (_: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post("users/", data)
  //         .then((response) => {
  //           resolve(response.data);
  //         })
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   confirmEmail: (_: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post(`users/${data.user}/confirm_email/`, data)
  //         .then(() => resolve())
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   confirmEmailChange: (context: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post(`users/${data.user}/confirm_email_change/`, data)
  //         .then((response) => {
  //           context.commit("setLoginData", response.data);
  //           context.commit("login", response.data);
  //           resolve();
  //         })
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   passwordForgotten: (_: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post("users/password_forgotten/", data)
  //         .then(() => resolve())
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   passwordReset: (_: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post(`users/${data.user}/reset_password/`, data)
  //         .then(() => resolve())
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   passwordChange: (_: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post(`users/${data.user}/change_password/`, data)
  //         .then(() => resolve())
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   changeEmail: (context: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post(`users/${data.user}/change_email/`, data)
  //         .then((response) => {
  //           context.commit(
  //             "setLoginData",
  //             Object.assign({}, context.getters.loginData, {
  //               user: response.data,
  //             }),
  //           );
  //           context.commit("setUser", response.data);
  //           resolve(response.data);
  //         })
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   changeName: (context: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .patch(`users/${context.getters.user.id}/change_name/`, data)
  //         .then((response) => {
  //           const newUser = JSON.parse(JSON.stringify(context.getters.user));
  //           newUser.user.name = response.data.name;
  //           context.commit(
  //             "setLoginData",
  //             Object.assign({}, context.getters.loginData, { user: newUser }),
  //           );
  //           context.commit("setUser", Object.assign({}, newUser));
  //           resolve(response.data);
  //         })
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
  //   patchShoppingUser: (context: ActionContext<UserState, RootState>, data) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .patch(`users/${data.id}/`, data)
  //         .then((response) => {
  //           context.commit(
  //             "setLoginData",
  //             Object.assign({}, context.getters.loginData, {
  //               user: response.data,
  //             }),
  //           );
  //           context.commit("setUser", response.data);
  //           resolve();
  //         })
  //         .catch((error) => reject(error.response.data));
  //     });
  //   },
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
    state.notifications = 0;
    state.admin = null;
  },
  setRlc: (state: UserState, rlc: Rlc) => {
    state.rlc = rlc;
  },
  setPermissions: (state: UserState, permissions: string[]) => {
    state.permissions = permissions;
  },
  setNotifications: (state: UserState, notifications: number) => {
    state.notifications = notifications;
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
