import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "user-login",
    component: () => import("@/views/user/Login.vue"),
  },
];

export default routes;
