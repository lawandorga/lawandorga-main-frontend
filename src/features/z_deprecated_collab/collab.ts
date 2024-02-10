import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/collab/",
    name: "collab-dashboard",
    component: () =>
      import("@/features/z_deprecated_collab/CollabDashboard.vue"),
  },
  {
    path: "/collab/:id/",
    name: "collab-detail",
    component: () => import("@/features/z_deprecated_collab/CollabDetail.vue"),
  },
];

export default routes;
