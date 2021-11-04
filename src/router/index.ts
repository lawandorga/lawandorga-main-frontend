import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";
import adminRoutes from "./admin";
import filesRoutes from "./files";
import recordsRoutes from "./records";
import statisticsRoutes from "./statistics";
import helpRoutes from "./help";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: { name: "user-login" },
    // component: () => import("@/views/Index.vue"),
  },
  ...userRoutes,
  ...recordsRoutes,
  ...filesRoutes,
  ...collabRoutes,
  ...statisticsRoutes,
  ...adminRoutes,
  ...helpRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
