import { RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/statistics/",
    name: "statistics-dashboard",
    component: () => import("@/views/statistics/StatisticsDashboard.vue"),
  },
];

export default routes;
