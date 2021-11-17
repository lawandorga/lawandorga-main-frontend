import { RouteRecordRaw } from "vue-router";
import { notAuthenticated } from "./utils";
import Login from "@/views/user/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/login",
    name: "user-login",
    component: Login,
    beforeEnter: notAuthenticated,
  },
];

export default routes;
