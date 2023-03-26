import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "../../router/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/v2/",
    name: "records-dashboard-v2",
    component: () => import("@/features/records/views/RecordsDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
