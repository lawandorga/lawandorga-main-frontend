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
    path: "/admin/groups/",
    name: "admin-groups",
    component: () => import("@/views/admin/AdminGroups.vue"),
  },
  {
    path: "/admin/groups/:id/",
    name: "admin-group",
    component: () => import("@/views/admin/AdminGroup.vue"),
  },
  {
    path: "/admin/record-permit-requests/",
    name: "admin-recordpermitrequests",
    component: () => import("@/views/admin/AdminAccessRequests.vue"),
  },
  {
    path: "/admin/record-deletion-requests/",
    name: "admin-recorddeletionrequests",
    component: () => import("@/views/admin/AdminDeletionRequests.vue"),
  },
  {
    path: "/admin/questionnaires/",
    name: "admin-questionnaires",
    component: () => import("@/views/admin/AdminQuestionnaires.vue"),
  },
  {
    path: "/admin/questionnaires/:id/",
    name: "admin-questionnaire",
    component: () => import("@/views/admin/AdminQuestionnaire.vue"),
  },
  {
    path: "/admin/templates/",
    name: "admin-templates",
    component: () => import("@/views/admin/AdminTemplates.vue"),
  },
  {
    path: "/admin/templates/:id/",
    name: "admin-template",
    component: () => import("@/views/admin/AdminTemplate.vue"),
  },
  {
    path: "/admin/sidebar/",
    name: "admin-sidebar",
    component: () => import("@/views/admin/AdminSidebar.vue"),
  },
];

export default routes;
