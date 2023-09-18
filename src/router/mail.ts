import { RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/mail/",
    name: "mail-dashboard",
    component: () => import("@/views/mail/MailDashboard.vue"),
  },
  {
    path: "/mail/user/:uuid/",
    name: "mail-user",
    component: () => import("@/views/mail/MailUser.vue"),
  },
  {
    path: "/mail/group/:uuid/",
    name: "mail-group",
    component: () => import("@/views/mail/MailGroup.vue"),
  },
];

export default routes;
