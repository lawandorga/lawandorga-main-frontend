import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/files/:id?/",
    name: "files-dashboard",
    component: () => import("@/views/files/FilesDashboard.vue"),
  },
];

export default routes;
