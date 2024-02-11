import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/statistics/",
    name: "statistics-dashboard",
    component: () =>
      import("@/features/statistics/views/StatisticsDashboard.vue"),
  },
];

export default routes;
