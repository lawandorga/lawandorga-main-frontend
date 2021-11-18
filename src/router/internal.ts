import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/internal/article/:id/",
    name: "internal-article",
    component: () => import("@/views/internal/InternalArticle.vue"),
  },
  {
    path: "/internal/imprint/",
    name: "internal-imprint",
    component: () => import("@/views/internal/InternalImprint.vue"),
  },
];

export default routes;
