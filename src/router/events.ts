import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/events/",
    name: "events-dashboard",
    component: () => import("@/views/events/EventsDashboard.vue"),
  },
];

export default routes;
