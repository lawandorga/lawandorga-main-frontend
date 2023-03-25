import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import dataSheetsRoutes from "./data_sheets";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";
import foldersRoutes from "./folders";
import internalRoutes from "./internal";
import legalRoutes from "./legal";
import eventsRoutes from "./events";
import mailRoutes from "./mail";
import DashboardPage from "@/views/DashboardPage.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import { isAuthenticated } from "./utils";
import NotFoundPage from "@/views/NotFoundPage.vue";
import StartPage from "@/views/StartPage.vue";
import uploadsRoutes from "./uploads";
import chatRoutes from "./chat";
import recordsRoutes from "./records";

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
  ...dataSheetsRoutes,
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
  ...uploadsRoutes,
  ...chatRoutes,
  {
    path: "/error",
    name: "error",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError((error, to) => {
  if (error.message.includes("Failed to fetch dynamically imported module")) {
    window.location.assign(to.fullPath);
  }
});

export default router;
