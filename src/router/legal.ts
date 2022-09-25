import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/legal/",
    name: "legal-dashboard",
    component: () => import("@/views/legal/LegalDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
