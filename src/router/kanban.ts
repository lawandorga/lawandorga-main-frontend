import { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/router/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/kanban/:id",
    name: "kanban-board",
    component: () => import("@/views/kanban/KanbanBoard.vue"),
    beforeEnter: isAuthenticated,
  },
];

export default routes;
