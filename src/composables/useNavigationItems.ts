import {
  RectangleStackIcon,
  FolderOpenIcon,
  LinkIcon,
  ChartPieIcon,
  CogIcon,
  LifebuoyIcon,
  ScaleIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  FolderIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/24/outline";
import { type Component, computed } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";

import { useUserStore } from "@/store/user";

export type NavigationItem = {
  label: string;
  icon: Component;
  is: "a" | "router-link";
  attrs?: {
    to?: RouteLocationRaw;
    href?: string;
    target?: "_blank";
    class?: string;
    rel?: string;
  };
  notifications?: number;
};

export default function useNavigationItems() {
  const store = useUserStore();
  const route = useRoute();
  const router = useRouter();

  const resolveRouteToPath = (target: string | RouteLocationRaw) => {
    if (typeof target === "string") return target;
    return router.resolve(target).path;
  };

  const isNavigationItemActive = (item: NavigationItem): boolean => {
    if (item.is !== "router-link" || !item.attrs?.to) {
      return false;
    }

    return route.path.startsWith(resolveRouteToPath(item.attrs.to));
  };

  const navigationItems = computed<NavigationItem[]>(() => {
    const items: NavigationItem[] = [
      {
        label: "Dashboard",
        icon: Squares2X2Icon,
        is: "router-link",
        attrs: { to: { name: "dashboard" } },
      },
      {
        label: "Folders",
        icon: FolderIcon,
        is: "router-link",
        attrs: {
          to: { name: "folders-dashboard" },
        },
      },
      {
        label: "Records",
        icon: RectangleStackIcon,
        is: "router-link",
        attrs: {
          to: { name: "records-dashboard-v2" },
        },
        notifications: store.recordBadges,
      },
    ];

    if (!store.org?.disable_files)
      items.push({
        label: "Files",
        icon: FolderOpenIcon,
        is: "router-link",
        attrs: { to: { name: "files-dashboard" } },
      });

    if (store.org?.is_events_enabled)
      items.push({
        label: "Events",
        icon: CalendarDaysIcon,
        is: "router-link",
        attrs: { to: { name: "events-dashboard" } },
      });

    items.push({
      label: "Statistics",
      icon: ChartPieIcon,
      is: "router-link",
      attrs: { to: { name: "statistics-dashboard" } },
    });

    if (store.org?.is_mail_enabled)
      items.push({
        label: "Mail",
        icon: EnvelopeIcon,
        is: "router-link",
        attrs: {
          to: { name: "mail-dashboard" },
        },
      });

    items.push(
      {
        label: "Admin",
        icon: CogIcon,
        is: "router-link",
        attrs: { to: { name: "admin-dashboard" } },
        notifications: store.adminBadges,
      },
      {
        label: "Help",
        icon: LifebuoyIcon,
        is: "router-link",
        attrs: { to: { name: "help-dashboard" } },
      },
      {
        label: "Legal",
        icon: ScaleIcon,
        notifications: store.badges?.legal,
        is: "router-link",
        attrs: { to: { name: "legal-dashboard" } },
      },
    );

    if (store.org?.is_chat_enabled)
      items.push({
        label: "Chat (Beta)",
        icon: ChatBubbleBottomCenterTextIcon,
        is: "router-link",
        attrs: { to: { name: "chat-dashboard" } },
      });

    if (store.user?.email === "dummy@law-orga.de")
      items.push({
        label: "Calendar (WIP)",
        icon: CalendarDaysIcon,
        is: "router-link",
        attrs: { to: { name: "calendar-dashboard" } },
      });

    return items;
  });

  const externalLinks = computed<NavigationItem[]>(() =>
    (store.org?.links ?? []).map((link) => ({
      label: link.name,
      icon: LinkIcon,
      is: "a",
      attrs: { href: link.link, target: "_blank", rel: "noopener" },
    })),
  );

  return {
    navigationItems,
    externalLinks,
    isNavigationItemActive,
  };
}
