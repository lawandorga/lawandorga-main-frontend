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
];

export default routes;
