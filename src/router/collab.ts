import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/collab/",
    name: "collab-dashboard",
    component: () => import("@/views/collab/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/collab/:id/",
    name: "collab-detail",
    component: () => import("@/views/collab/Detail.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
