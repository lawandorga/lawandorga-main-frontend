import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/",
    name: "records-dashboard",
    redirect: { name: "records-dashboard-v2" },
  },
  {
    path: "/records/:record/",
    name: "records-detail",
    component: () => import("@/features/data_sheets/views/RecordsDetail.vue"),
  },
  {
    path: "/data-sheets/migrate/",
    name: "data-sheets-migrate",
    component: () => import("@/features/data_sheets/views/MigrateView.vue"),
  },
  {
    path: "/admin/templates/",
    name: "admin-templates",
    component: () => import("@/features/data_sheets/views/AdminList.vue"),
  },
  {
    path: "/admin/templates/:id/",
    name: "admin-template",
    component: () => import("@/features/data_sheets/views/AdminDetail.vue"),
  },
];

export default routes;
