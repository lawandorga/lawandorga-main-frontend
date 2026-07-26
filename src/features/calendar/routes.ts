import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/calendar/",
    name: "calendar-dashboard",
    component: () => import("@/features/calendar/views/CalendarDashboard.vue"),
  },
];

export default routes;
