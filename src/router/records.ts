import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/",
    name: "records-dashboard",
    component: () => import("@/views/records/Dashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
