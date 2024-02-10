import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/help/",
    name: "help-dashboard",
    component: () => import("@/features/help/views/HelpDashboard.vue"),
  },
  {
    path: "/help/permissions/",
    name: "help-permissions",
    component: () => import("@/features/help/views/HelpPermissions.vue"),
  },
];

export default routes;
