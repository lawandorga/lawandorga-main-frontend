import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import userRoutes from "@/features/user/routes";
import adminRoutes from "@/features/admin/routes";
import dataSheetsRoutes from "@/features/data_sheets/routes";
import statisticsRoutes from "@/features/statistics/routes";
import helpRoutes from "@/features/help/routes";
import internalRoutes from "@/features/internal/routes";
import legalRoutes from "@/features/legal/routes";
import eventsRoutes from "@/features/events/routes";
import mailRoutes from "@/features/mail/routes";
import DashboardPage from "@/features/dashboard/views/DashboardPage.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import StartPage from "@/views/StartPage.vue";
import uploadsRoutes from "@/features/uploads/routes";
import chatRoutes from "@/features/matrix_chat/routes";
import recordsRoutes from "@/features/records/routes";
import questionnaireRoutes from "@/features/questionnaires/routes";
import orgRoutes from "@/features/org/routes";
import folderRoutes from "@/features/folders/routes";
import usersRoutes from "@/features/users/routes";
import oldFilesRoutes from "@/features/z_deprecated_files/files";
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
  ...usersRoutes,
  ...userRoutes,
  ...dataSheetsRoutes,
  ...recordsRoutes,
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
  ...oldFilesRoutes,
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
