import { RouteRecordRaw } from "vue-router";
import { notAuthenticated } from "./utils";
import UserLogin from "@/views/user/UserLogin.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "user-login",
    component: UserLogin,
  },
  {
    path: "/user/keys/",
    name: "user-keys",
    component: () => import("@/views/user/UserKeys.vue"),
  },
  {
    path: "/user/optimize/",
    name: "user-optimize",
    component: () => import("@/views/user/UserOptimize.vue"),
  },
  {
    path: "/user/email-confirm/:user/:token/",
    name: "user-emailconfirm",
    component: () => import("@/views/user/UserEmailConfirmation.vue"),
    beforeEnter: notAuthenticated,
  },
];

export default routes;
