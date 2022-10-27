import { Component, computed } from "vue";
import {
  RectangleStackIcon,
  FolderOpenIcon,
  LinkIcon,
  DocumentTextIcon,
  ChartPieIcon,
  CogIcon,
  LifebuoyIcon,
  ScaleIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
} from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { RouteLocationRaw } from "vue-router";

type NavigationItem = {
  label?: string;
  icon?: Component;
  attrs?: { to?: RouteLocationRaw; href?: string; target?: "_blank" };
  permissions?: string[];
  notifications?: number;
  divider?: boolean;
  is?: "a" | "router-link" | "divider";
};

export default function useNavigationItems() {
  const store = useUserStore();

  const navigationItems = computed<NavigationItem[]>(() => {
    const items1: NavigationItem[] = [
      {
        label: "Dashboard",
        icon: Squares2X2Icon,
        is: "router-link",
        attrs: { to: { name: "dashboard" } },
        permissions: [],
      },
      {
        label: "Records",
        icon: RectangleStackIcon,
        is: "router-link",
        attrs: { to: { name: "records-dashboard" } },
        permissions: [],
      },
      {
        label: "Files",
        icon: FolderOpenIcon,
        is: "router-link",
        attrs: { to: { name: "files-dashboard" } },
        permissions: [],
      },
      {
        label: "Collab",
        icon: DocumentTextIcon,
        is: "router-link",
        attrs: { to: { name: "collab-dashboard" } },
        permissions: [],
      },
      {
        label: "Events",
        icon: CalendarDaysIcon,
        is: "router-link",
        attrs: { to: { name: "events-dashboard" } },
        permissions: [],
      },
      {
        label: "Statistics",
        icon: ChartPieIcon,
        is: "router-link",
        attrs: { to: { name: "statistics-dashboard" } },
        permissions: [],
      },
      {
        label: "Admin",
        icon: CogIcon,
        is: "router-link",
        attrs: { to: { name: "admin-dashboard" } },
        notifications: store.adminBadges,
        permissions: [],
      },
      {
        label: "Help",
        icon: LifebuoyIcon,
        is: "router-link",
        attrs: { to: { name: "help-dashboard" } },
        permissions: [],
      },
    ];

    items1.push({
      label: "Legal",
      icon: ScaleIcon,
      notifications: store.badges?.legal,
      is: "router-link",
      attrs: { to: { name: "legal-dashboard" } },
      permissions: [],
    });

    if (store.rlc?.links.length) {
      items1.push({ divider: true });
      store.rlc?.links.forEach((l) => {
        items1.push({
          label: l.name,
          icon: LinkIcon,
          is: "a",
          attrs: { href: l.link, target: "_blank" },
          permissions: [],
        });
      });
    }

    return items1;
  });

  return {
    navigationItems,
  };
}
