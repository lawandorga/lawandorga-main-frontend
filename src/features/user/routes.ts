import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/optimize/",
    name: "user-optimize",
    component: () => import("@/features/user/views/UserOptimize.vue"),
  },
  {
    path: "/user/email-confirm/:user/:token/",
    name: "user-emailconfirm",
    component: () => import("@/features/user/views/UserEmailConfirmation.vue"),
  },
];

export default routes;
