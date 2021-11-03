import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/help/",
    name: "help-dashboard",
    component: () => import("@/views/help/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
