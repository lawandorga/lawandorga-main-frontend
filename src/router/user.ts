import { RouteRecordRaw } from "vue-router";
import { notAuthenticated } from "./utils";
import UserLogin from "@/views/user/UserLogin.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "user-login",
    component: UserLogin,
    beforeEnter: notAuthenticated,
  },
  {
    path: "/user/register/",
    name: "user-register",
    component: () => import("@/views/user/UserRegister.vue"),
    beforeEnter: notAuthenticated,
  },
  {
    path: "/user/password-reset/",
    name: "user-passwordreset",
    component: () => import("@/views/user/UserRequestPasswordReset.vue"),
    beforeEnter: notAuthenticated,
  },
  {
    path: "/user/password-reset-confirm/:user/:token/",
    name: "user-passwordresetconfirm",
    component: () => import("@/views/user/UserPasswordReset.vue"),
    beforeEnter: notAuthenticated,
  },
  {
    path: "/user/email-confirm/:user/:token/",
    name: "user-emailconfirm",
    component: () => import("@/views/user/UserEmailConfirmation.vue"),
    beforeEnter: notAuthenticated,
  },
];

export default routes;
