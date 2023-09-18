import { RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/help/",
    name: "help-dashboard",
    component: () => import("@/views/help/HelpDashboard.vue"),
  },
  {
    path: "/help/permissions/",
    name: "help-permissions",
    component: () => import("@/views/help/HelpPermissions.vue"),
  },
];

export default routes;
