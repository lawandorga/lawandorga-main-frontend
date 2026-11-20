import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/internal/article/:id/",
    name: "internal-article",
    component: () => import("@/features/internal/views/InternalArticle.vue"),
  },
  {
    path: "/internal/articles/",
    name: "internal-articles",
    component: () => import("@/features/internal/views/InternalArticles.vue"),
    // public page with its own header and footer (see App.vue)
    meta: { standalone: true },
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
