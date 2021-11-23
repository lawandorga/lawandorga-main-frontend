import { NavigationGuard } from "vue-router";
import store from "../store";

export const isAuthenticated: NavigationGuard = (to, _, next) => {
  if (store.getters["user/isAuthenticated"]) {
    next();
    return;
  }
  next({
    name: "user-login",
    query: { next: to.fullPath },
  });
};

export const notAuthenticated: NavigationGuard = (_, __, next) => {
  if (!store.getters["user/isAuthenticated"]) {
    next();
    return;
  }
  next({
    name: "dashboard",
  });
};
