import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/files/:id?/",
    name: "files-dashboard",
    component: () => import("@/features/z_deprecated_files/FilesDashboard.vue"),
  },
];

export default routes;
