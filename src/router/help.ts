import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/help/",
    name: "help-dashboard",
    component: () => import("@/views/help/HelpDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/help/permissions/",
    name: "help-permissions",
    component: () => import("@/views/help/HelpPermissions.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
