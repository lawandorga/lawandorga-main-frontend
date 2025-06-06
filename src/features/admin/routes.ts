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
    component: () => import("@/features/admin/views/AdminOrgUsers.vue"),
  },
  {
    path: "/admin/org/",
    name: "admin-org",
    component: () => import("@/features/admin/views/AdminOrg.vue"),
  },
  {
    path: "/admin/profiles/:id/",
    name: "admin-profile",
    component: () => import("@/features/admin/views/AdminOrgUser.vue"),
  },
  {
    path: "/admin/sidebar/",
    name: "admin-sidebar",
    component: () => import("@/features/admin/views/AdminSidebar.vue"),
  },
  {
    path: "/admin/collab/templates",
    name: "admin-collab-templates",
    component: () => import("@/features/admin/views/AdminCollabTemplates.vue"),
  },
  {
    path: "/admin/collab/template/:uuid",
    name: "admin-collab-edit-template",
    component: () => import("@/features/admin/views/AdminCollabTemplate.vue"),
  },
];

export default routes;
