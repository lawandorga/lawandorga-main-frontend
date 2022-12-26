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
    path: "/records/:record/",
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
  {
    path: "/records/upload/",
    name: "records-upload",
    component: () => import("@/views/records/RecordsUpload.vue"),
  },
  {
    path: "/records/upload/:code/",
    name: "records-questionnaire",
    component: () => import("@/views/records/RecordsQuestionnaire.vue"),
  },
];

export default routes;
