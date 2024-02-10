import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/optimize/",
    name: "user-optimize",
    component: () => import("@/views/user/UserOptimize.vue"),
  },
  {
    path: "/user/email-confirm/:user/:token/",
    name: "user-emailconfirm",
    component: () => import("@/views/user/UserEmailConfirmation.vue"),
  },
];

export default routes;
