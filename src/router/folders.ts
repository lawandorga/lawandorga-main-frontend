import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/folders/",
    name: "folders-dashboard",
    component: () => import("@/views/folders/FoldersDashboard.vue"),
  },
  {
    path: "/folders/:uuid/:record?/",
    name: "folders-detail",
    component: () => import("@/views/folders/FoldersDetail.vue"),
  },
];

export default routes;
