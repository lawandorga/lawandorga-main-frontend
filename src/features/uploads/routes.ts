import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/uploads/:uuid",
    name: "uploads-upload",
    component: () => import("@/features/uploads/views/UploadsUpload.vue"),
  },
];

export default routes;
