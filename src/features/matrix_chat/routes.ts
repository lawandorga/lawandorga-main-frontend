import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/chat/",
    name: "chat-dashboard",
    component: () => import("@/features/matrix_chat/views/ChatDashboard.vue"),
  },
];

export default routes;
