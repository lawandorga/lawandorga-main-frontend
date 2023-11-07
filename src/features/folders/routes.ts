import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/folders/",
    name: "folders-dashboard",
    component: () => import("@/features/folders/views/FoldersDashboard.vue"),
  },
  {
    path: "/folders/:uuid/:record?/",
    name: "folders-detail",
    component: () => import("@/features/folders/views/FoldersDetail.vue"),
  },
];

export default routes;
