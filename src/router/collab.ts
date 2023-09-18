import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/collab/",
    name: "collab-dashboard",
    component: () => import("@/views/collab/CollabDashboard.vue"),
  },
  {
    path: "/collab/:id/",
    name: "collab-detail",
    component: () => import("@/views/collab/CollabDetail.vue"),
  },
];

export default routes;
