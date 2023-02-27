import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/chat/",
    name: "chat-dashboard",
    component: () => import("@/views/chat/ChatDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
