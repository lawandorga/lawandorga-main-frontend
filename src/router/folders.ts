import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/folders/:id?/",
    name: "folders-dashboard",
    component: () => import("@/views/folders/FoldersDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
