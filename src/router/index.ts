import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import recordsRoutes from "./records";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";
import internalRoutes from "./internal";
import legalRoutes from "./legal";
import Dashboard from "@/views/DashboardPage.vue";
import { isAuthenticated } from "./utils";
import NotFoundPage from "@/views/NotFoundPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: { name: "user-login" },
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
  ...legalRoutes,
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

console.info("router created");

export default router;
