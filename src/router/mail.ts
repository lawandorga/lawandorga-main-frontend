import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "./utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/mail/",
    name: "mail-dashboard",
    component: () => import("@/views/mail/MailDashboard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
