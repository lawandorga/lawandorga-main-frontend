import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/records/",
    name: "records-dashboard",
    component: () => import("@/views/records/RecordsDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/records/:id/",
    name: "records-detail",
    component: () => import("@/views/records/RecordsDetail.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/records/pool/",
    name: "records-pool",
    component: () => import("@/views/records/RecordsPool.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
