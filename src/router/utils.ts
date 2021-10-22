import { NavigationGuard } from "vue-router";
import store from "../store";

export const isAuthenticated: NavigationGuard = (to, _, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next({
    name: "user-login",
    query: { next: to.fullPath },
  });
};
