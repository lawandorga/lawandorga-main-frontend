import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin/groups/",
    name: "admin-groups",
    component: () => import("@/features/org/views/AdminGroups.vue"),
  },
  {
    path: "/admin/groups/:id/",
    name: "admin-group",
    component: () => import("@/features/org/views/AdminGroup.vue"),
  },
];

export default routes;
