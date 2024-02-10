import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/events/",
    name: "events-dashboard",
    component: () => import("@/features/events/views/EventsDashboard.vue"),
  },
];

export default routes;
