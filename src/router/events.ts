import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/router/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/events/",
    name: "event-dashboard",
    component: () => import("@/views/events/EventDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
