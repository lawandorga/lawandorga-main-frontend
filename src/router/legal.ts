import { RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/legal/",
    name: "legal-dashboard",
    component: () => import("@/views/legal/LegalDashboard.vue"),
  },
];

export default routes;
