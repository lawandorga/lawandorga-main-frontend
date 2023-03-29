import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/router/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/",
    name: "records-dashboard",
    component: () => import("@/views/data_sheets/RecordsDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/records/:record/",
    name: "records-detail",
    component: () => import("@/views/data_sheets/RecordsDetail.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/records/pool/",
    name: "records-pool",
    component: () => import("@/views/data_sheets/RecordsPool.vue"),
    beforeEnter: isAuthenticated,
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
