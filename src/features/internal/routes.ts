import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/internal/article/:id/",
    name: "internal-article",
    component: () => import("@/features/internal/views/InternalArticle.vue"),
  },
  {
    path: "/internal/imprint/",
    name: "internal-imprint",
    component: () => import("@/features/internal/views/InternalImprint.vue"),
  },
  {
    path: "/internal/toms/",
    name: "internal-toms",
    component: () => import("@/features/internal/views/InternalToms.vue"),
  },
];

export default routes;
