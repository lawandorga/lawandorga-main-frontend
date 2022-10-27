import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/router/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/events/",
    name: "events-dashboard",
    component: () => import("@/views/events/EventsDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
