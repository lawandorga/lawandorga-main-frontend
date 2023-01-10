import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import recordsRoutes from "./records";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";
import foldersRoutes from "./folders";
import internalRoutes from "./internal";
import legalRoutes from "./legal";
import eventsRoutes from "./events";
import mailRoutes from "./mail";
import DashboardPage from "@/views/DashboardPage.vue";
import { isAuthenticated } from "./utils";
import NotFoundPage from "@/views/NotFoundPage.vue";
import StartPage from "@/views/StartPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: { name: "start" },
  },
  {
    path: "/start/",
    name: "start",
    component: StartPage,
  },
  {
    path: "/dashboard/",
    name: "dashboard",
    component: DashboardPage,
    beforeEnter: isAuthenticated,
  },
  ...foldersRoutes,
  ...userRoutes,
  ...recordsRoutes,
  ...filesRoutes,
  ...collabRoutes,
  ...statisticsRoutes,
  ...adminRoutes,
  ...helpRoutes,
  ...internalRoutes,
  ...legalRoutes,
  ...eventsRoutes,
  ...mailRoutes,
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
