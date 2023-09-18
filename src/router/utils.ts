import { NavigationGuard } from "vue-router";
import { useUserStore } from "@/store/user";

export const notAuthenticated: NavigationGuard = (to) => {
  const userStore = useUserStore();
  if (userStore.isAuthenticated) {
    const url = to.query.next as string;
    if (url) return url;
    else return { name: "admin-dashboard" };
  }
};
