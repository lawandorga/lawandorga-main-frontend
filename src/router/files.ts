import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/files/:id?/",
    name: "files-dashboard",
    component: () => import("@/views/files/FilesDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
