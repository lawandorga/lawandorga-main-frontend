import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/questionnaires/admin/",
    name: "questionnaires-admin-list",
    component: () => import("@/features/questionnaires/views/AdminList.vue"),
  },
];

export default routes;
