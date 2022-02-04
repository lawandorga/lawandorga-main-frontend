import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import recordsRoutes from "./records";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";
import internalRoutes from "./internal";
import Dashboard from "@/views/DashboardPage.vue";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: { name: "dashboard" },
    // component: () => import("@/views/Index.vue"),
  },
  {
    path: "/dashboard/",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: isAuthenticated,
  },
  ...userRoutes,
  ...recordsRoutes,
  ...filesRoutes,
  ...collabRoutes,
  ...statisticsRoutes,
  ...adminRoutes,
  ...helpRoutes,
  ...internalRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

console.info("router created");

export default router;
