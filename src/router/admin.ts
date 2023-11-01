import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin/",
    name: "admin-dashboard",
    component: () => import("@/views/admin/AdminDashboard.vue"),
  },
  {
    path: "/admin/profiles/",
    name: "admin-profiles",
    component: () => import("@/views/admin/AdminProfiles.vue"),
  },
  {
    path: "/admin/profiles/:id/",
    name: "admin-profile",
    component: () => import("@/views/admin/AdminProfile.vue"),
  },
  {
    path: "/admin/sidebar/",
    name: "admin-sidebar",
    component: () => import("@/views/admin/AdminSidebar.vue"),
  },
];

export default routes;
