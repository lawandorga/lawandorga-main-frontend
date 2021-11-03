import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/statistics/",
    name: "statistics-dashboard",
    component: () => import("@/views/statistics/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
