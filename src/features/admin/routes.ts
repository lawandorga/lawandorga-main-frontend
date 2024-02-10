import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin/",
    name: "admin-dashboard",
    component: () => import("@/features/admin/views/AdminDashboard.vue"),
  },
  {
    path: "/admin/profiles/",
    name: "admin-profiles",
    component: () => import("@/features/admin/views/AdminProfiles.vue"),
  },
  {
    path: "/admin/profiles/:id/",
    name: "admin-profile",
    component: () => import("@/features/admin/views/AdminProfile.vue"),
  },
  {
    path: "/admin/sidebar/",
    name: "admin-sidebar",
    component: () => import("@/features/admin/views/AdminSidebar.vue"),
  },
];

export default routes;
