import { NavigationGuard } from "vue-router";
import store from "../store";
import { useUserStore } from "@/store/user";
import { getNextQuery } from "@/utils/router";

export const isAuthenticated: NavigationGuard = (to) => {
  if (!store.getters["user/isAuthenticated"]) {
    return {
      name: "user-login",
      query: getNextQuery(to.fullPath),
    };
  }

  const userStore = useUserStore();
  if (userStore.user?.locked && to.name !== "user-keys") {
    store.dispatch("alert/createAlert", {
      heading: "Account locked",
      type: "error",
      message: "Your account is locked, please check your keys.",
    });
    return {
      name: "user-keys",
    };
  }
  if (userStore.user?.locked_legal && to.name !== "legal-dashboard") {
    store.dispatch("alert/createAlert", {
      heading: "Account legally locked",
      type: "error",
      message:
        "Your account is legally locked, please accept the legal requirements.",
    });
    return {
      name: "legal-dashboard",
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
