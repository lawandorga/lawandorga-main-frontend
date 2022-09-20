import { NavigationGuard } from "vue-router";
import store from "../store";
import { useUserStore } from "@/store/user";

export const isAuthenticated: NavigationGuard = (to) => {
  if (!store.getters["user/isAuthenticated"]) {
    return {
      name: "user-login",
      query: { next: to.fullPath },
    };
  }

  const userStore = useUserStore();
  if (userStore.locked) {
    store.dispatch("alert/createAlert", {
      heading: "Account locked",
      type: "error",
      message: "Your account is locked, please check your keys.",
    });
    return {
      name: "user-keys",
    };
  }
};

export const isAuthenticatedButLockedAllowed: NavigationGuard = (to) => {
  if (!store.getters["user/isAuthenticated"]) {
    return {
      name: "user-login",
      query: { next: to.fullPath },
    };
  }
};

export const notAuthenticated: NavigationGuard = (to) => {
  if (store.getters["user/isAuthenticated"]) {
    const url = to.query.next as string;
    if (url) return url;
    else return { name: "admin-dashboard" };
  }
};
