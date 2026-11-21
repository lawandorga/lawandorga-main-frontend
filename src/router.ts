import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import adminRoutes from "@/features/admin/routes";
import calendarRoutes from "@/features/calendar/routes";
import DashboardPage from "@/features/dashboard/views/DashboardPage.vue";
import dataSheetsRoutes from "@/features/data_sheets/routes";
import eventsRoutes from "@/features/events/routes";
import folderRoutes from "@/features/folders/routes";
import helpRoutes from "@/features/help/routes";
import internalRoutes from "@/features/internal/routes";
import legalRoutes from "@/features/legal/routes";
import mailRoutes from "@/features/mail/routes";
import chatRoutes from "@/features/matrix_chat/routes";
import orgRoutes from "@/features/org/routes";
import questionnaireRoutes from "@/features/questionnaires/routes";
import recordsRoutes from "@/features/records/routes";
import statisticsRoutes from "@/features/statistics/routes";
import uploadsRoutes from "@/features/uploads/routes";
import userRoutes from "@/features/user/routes";
import usersRoutes from "@/features/users/routes";
import oldFilesRoutes from "@/features/z_deprecated_files/files";
import { useUserStore } from "@/store/user";
import ErrorPage from "@/views/ErrorPage.vue";
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
  ...calendarRoutes,
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

router.beforeEach((to) => {
  const store = useUserStore();
  if (store.isAuthenticated && store.locked && to.name !== "user-keys") {
    return { name: "user-keys" };
  }
});

export default router;
