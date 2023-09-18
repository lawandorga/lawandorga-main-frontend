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
    component: () => import("@/views/data_sheets/RecordsDetail.vue"),
  },
  {
    path: "/records/upload/",
    name: "records-upload",
    component: () => import("@/views/data_sheets/RecordsUpload.vue"),
  },
  {
    path: "/records/upload/:code/",
    name: "records-questionnaire",
    component: () => import("@/views/data_sheets/RecordsQuestionnaire.vue"),
  },
  {
    path: "/data-sheets/migrate/",
    name: "data-sheets-migrate",
    component: () => import("@/features/data_sheets/views/MigrateView.vue"),
  },
];

export default routes;
