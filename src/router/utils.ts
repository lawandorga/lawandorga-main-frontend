import { NavigationGuard } from "vue-router";
import store from "../store";

export const isAuthenticated: NavigationGuard = (to) => {
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
