import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import dataSheetsRoutes from "@/features/data_sheets/routes";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";
import internalRoutes from "./internal";
import legalRoutes from "@/features/legal/routes";
import eventsRoutes from "./events";
import mailRoutes from "@/features/mail/routes";
import DashboardPage from "@/views/DashboardPage.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import StartPage from "@/views/StartPage.vue";
import uploadsRoutes from "./uploads";
import chatRoutes from "./chat";
import recordsRoutes from "@/features/records/routes";
import questionnaireRoutes from "@/features/questionnaires/routes";
import orgRoutes from "@/features/org/routes";
import folderRoutes from "@/features/folders/routes";
import collabRoutes from "@/features/collab/routes";
import oldCollabRoutes from "./collab";
import { useUserStore } from "@/store/user";

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
  },
  ...folderRoutes,
  ...userRoutes,
  ...collabRoutes,
  ...oldCollabRoutes,
  ...dataSheetsRoutes,
  ...recordsRoutes,
  ...filesRoutes,
  ...statisticsRoutes,
  ...adminRoutes,
  ...helpRoutes,
  ...internalRoutes,
  ...legalRoutes,
  ...eventsRoutes,
  ...mailRoutes,
  ...uploadsRoutes,
  ...chatRoutes,
  ...questionnaireRoutes,
  ...orgRoutes,
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

router.beforeEach((to, _, next) => {
  const store = useUserStore();
  if (store.isAuthenticated && store.locked && to.name !== "user-keys") {
    next({ name: "user-keys" });
  } else {
    next();
  }
});

export default router;
