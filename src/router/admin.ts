import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin/",
    name: "admin-dashboard",
    component: () => import("@/views/admin/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
