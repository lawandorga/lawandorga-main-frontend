import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user/keys/",
    name: "user-keys",
    component: () => import("@/features/users/views/UserKeys.vue"),
  },
];

export default routes;
