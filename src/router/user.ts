import { RouteRecordRaw } from "vue-router";
import { notAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "user-login",
    component: () => import("@/views/user/Login.vue"),
    beforeEnter: notAuthenticated,
  },
];

export default routes;
