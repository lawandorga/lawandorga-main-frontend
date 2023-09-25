import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/mail/",
    name: "mail-dashboard",
    component: () => import("@/features/mail/views/MailDashboard.vue"),
  },
  {
    path: "/mail/user/:uuid/",
    name: "mail-user",
    component: () => import("@/features/mail/views/MailUser.vue"),
  },
  {
    path: "/mail/group/:uuid/",
    name: "mail-group",
    component: () => import("@/features/mail/views/MailGroup.vue"),
  },
];

export default routes;
