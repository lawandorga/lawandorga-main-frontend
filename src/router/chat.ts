import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/chat/",
    name: "chat-dashboard",
    component: () => import("@/views/chat/ChatDashboard.vue"),
  },
];

export default routes;
