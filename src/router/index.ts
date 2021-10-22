import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import collabRoutes from "./collab";
import userRoutes from "./user";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/Index.vue"),
  },
  ...userRoutes,
  ...collabRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
