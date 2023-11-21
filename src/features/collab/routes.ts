import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/collab/migrate/",
    name: "collab-migrate",
    component: () => import("@/features/collab/views/CollabMigrate.vue"),
  },
  {
    path: "/collab/",
    name: "collab-dashboard",
    redirect: { name: "collab-migrate" },
  },
  {
    path: "/collab/:id/",
    name: "collab-detail",
    redirect: { name: "collab-migrate" },
  },
];

export default routes;
