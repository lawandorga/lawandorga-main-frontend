import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/files/",
    name: "files-dashboard",
    component: () => import("@/views/files/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
