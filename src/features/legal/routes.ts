import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/legal/",
    name: "legal-dashboard",
    component: () => import("@/features/legal/views/LegalDashboard.vue"),
  },
];

export default routes;
