import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/mail/",
    name: "mail-dashboard",
    component: () => import("@/views/mail/MailDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/mail/user/:uuid/",
    name: "mail-user",
    component: () => import("@/views/mail/MailUser.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/mail/group/:uuid/",
    name: "mail-group",
    component: () => import("@/views/mail/MailGroup.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
