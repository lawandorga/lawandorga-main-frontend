import { RootState, UserState } from "@/types/state";
import axios from "axios";
import router from "../router/index";
import { ActionContext } from "vuex";
import { RlcUser } from "@/types/user";

const state = {
  token: null,
  key: null,
  user: {},
};

const getters = {
  user: (state: UserState) => state.user,
  token: (state: UserState) => `Token ${state.token}`,
  key: (state: UserState) =>
    state.key ? state.key.replace(/(?:\r\n|\r|\n)/g, "<linebreak>") : "",
  isAuthenticated: (state: UserState) => state.token && state.key,
  loginData: () => JSON.parse(localStorage.getItem("loginData") || "{}"),
};

const actions = {
  autoLogin(context: ActionContext<UserState, RootState>) {
    const loginData = context.getters.loginData;
    if (!loginData) {
      return;
    }
    context.commit("login", loginData);
  },
  login: (
    context: ActionContext<UserState, RootState>,
    data: { email: string; password: string; next?: string },
  ) => {
    return new Promise((_, reject) => {
      axios
        .post("profiles/login/", data)
        .then((response) => {
          context.commit("setLoginData", response.data);
          context.commit("login", response.data);
          if (data.next) router.push(data.next);
          else router.push({ name: "collab-dashboard" });
        })
        .catch((error) => reject(error.response.data));
    });
  },
  logout: (context: ActionContext<UserState, RootState>) => {
    return new Promise<void>((resolve, reject) => {
      if (context.getters.isAuthenticated) {
        context.commit("unsetLoginData");
        context.commit("logout");
        resolve();
      } else {
        reject();
      }
    });
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
    data: { token: string; user: RlcUser; key: string },
  ) => {
    state.token = data.token;
    state.user = data.user;
    state.key = data.key;
  },
  logout: (state: UserState) => {
    state.token = null;
    state.user = null;
  },
  setUser: (state: UserState, data: RlcUser) => {
    state.user = data;
  },
  setLoginData: (
    _: ActionContext<UserState, RootState>,
    data: { token: string; key: string },
  ) => {
    localStorage.setItem("loginData", JSON.stringify(data));
  },
  unsetLoginData: () => {
    localStorage.removeItem("loginData");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
