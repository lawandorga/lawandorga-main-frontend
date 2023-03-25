import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/v2/",
    name: "records-dashboard-v2",
    component: () => import("@/views/records/RecordsDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
