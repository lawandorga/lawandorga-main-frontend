import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/",
    name: "records-dashboard-v2",
    component: () => import("@/features/records/views/RecordsDashboard.vue"),
  },
];

export default routes;
