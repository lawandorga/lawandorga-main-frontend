import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/uploads/:uuid",
    name: "uploads-upload",
    component: () => import("@/views/uploads/UploadsUpload.vue"),
  },
];

export default routes;
