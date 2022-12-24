import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/folders/",
    name: "folders-dashboard",
    component: () => import("@/views/folders/FoldersDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/folders/:uuid/:record?/",
    name: "folders-detail",
    component: () => import("@/views/records/RecordsDetail.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
