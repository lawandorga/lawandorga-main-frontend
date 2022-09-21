import { RootState, UserState } from "@/types/state";
import router from "../router";
import { ActionContext } from "vuex";
import { LoginResponse, RefreshResponse, RlcUser } from "@/types/user";
import UserService from "@/services/user";
import { useUserStore } from "./user";

const state = {
  access: null,
  refresh: null,
  task: null,
};

const getters = {
  // auth
  token: (state: UserState) => `Bearer ${state.access}`,
  access: (state: UserState) => state.access,
  refresh: (state: UserState) => state.refresh,
  isAuthenticated: (state: UserState) => !!state.access && !!state.refresh,
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
};

const mutations = {
  login: (state: UserState, data: { access: string; refresh: string }) => {
    localStorage.setItem("access", data.access);
    state.access = data.access;
    localStorage.setItem("refresh", data.refresh);
    state.refresh = data.refresh;
    //
    const userStore = useUserStore();
    userStore.updateData();
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
    //
    const userStore = useUserStore();
    userStore.reset();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
