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
  {
    path: "/admin/collab/templates",
    name: "admin-collab-templates",
    component: () => import("@/features/admin/views/AdminCollabTemplates.vue"),
  },
  {
    path: "/admin/collab/letterhead/:uuid",
    name: "admin-collab-letterhead",
    component: () => import("@/features/admin/views/AdminCollabLetterhead.vue"),
  },
  {
    path: "/admin/collab/footer/:uuid",
    name: "admin-collab-footer",
    component: () => import("@/features/admin/views/AdminCollabFooter.vue"),
  },
  {
    path: "/admin/collab/template/:uuid",
    name: "admin-collab-edit-template",
    component: () =>
      import("@/features/admin/views/AdminCollabEditTemplate.vue"),
  },
];

export default routes;
