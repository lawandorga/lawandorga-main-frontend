import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/questionnaires/admin/",
    name: "questionnaires-admin-list",
    component: () => import("@/features/questionnaires/views/AdminList.vue"),
  },
  {
    path: "/questionnaires/admin/:id/",
    name: "questionnaires-admin-detail",
    component: () => import("@/features/questionnaires/views/AdminDetail.vue"),
  },
  {
    path: "/records/upload/",
    name: "records-upload",
    component: () =>
      import("@/features/questionnaires/views/RecordsUpload.vue"),
  },
  {
    path: "/records/upload/:code/",
    name: "records-questionnaire",
    component: () =>
      import("@/features/questionnaires/views/RecordsQuestionnaire.vue"),
  },
];

export default routes;
