import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin/",
    name: "admin-dashboard",
    component: () => import("@/views/admin/AdminDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/notifications/",
    name: "admin-notifications",
    component: () => import("@/views/admin/Notifications.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/profiles/",
    name: "admin-profiles",
    component: () => import("@/views/admin/AdminProfiles.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/profiles/:id/",
    name: "admin-profile",
    component: () => import("@/views/admin/AdminProfile.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/tags/",
    name: "admin-tags",
    component: () => import("@/views/admin/AdminTags.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/groups/",
    name: "admin-groups",
    component: () => import("@/views/admin/AdminGroups.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/groups/:id/",
    name: "admin-group",
    component: () => import("@/views/admin/AdminGroup.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/record-permit-requests/",
    name: "admin-recordpermitrequests",
    component: () => import("@/views/admin/AdminPermissionRequests.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/record-deletion-requests/",
    name: "admin-recorddeletionrequests",
    component: () => import("@/views/admin/AdminDeletionRequests.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/questionnaires/",
    name: "admin-questionnaires",
    component: () => import("@/views/admin/AdminQuestionnaires.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/questionnaires/:id/",
    name: "admin-questionnaire",
    component: () => import("@/views/admin/AdminQuestionnaire.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/templates/",
    name: "admin-templates",
    component: () => import("@/views/admin/AdminTemplates.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/admin/template/",
    name: "admin-template",
    component: () => import("@/views/admin/AdminTemplate.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
