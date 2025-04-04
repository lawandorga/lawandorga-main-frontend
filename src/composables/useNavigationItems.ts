import { type Component, computed } from "vue";
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
import { useUserStore } from "@/store/user";
import { RouteLocationRaw } from "vue-router";

type NavigationItem = {
  label?: string;
  icon?: Component;
  attrs?: {
    to?: RouteLocationRaw;
    href?: string;
    target?: "_blank";
    class?: string;
    rel?: string;
  };
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
        label: "Folders",
        icon: FolderIcon,
        is: "router-link",
        attrs: {
          to: { name: "folders-dashboard" },
        },
        permissions: [],
      },
      {
        label: "Records",
        icon: RectangleStackIcon,
        is: "router-link",
        attrs: {
          to: { name: "records-dashboard-v2" },
        },
        permissions: [],
        notifications: store.recordBadges,
      },
    ];

    if (!store.org?.disable_files)
      items1.push({
        label: "Files",
        icon: FolderOpenIcon,
        is: "router-link",
        attrs: { to: { name: "files-dashboard" } },
        permissions: [],
      });

    if (store.org?.is_events_enabled)
      items1.push({
        label: "Events",
        icon: CalendarDaysIcon,
        is: "router-link",
        attrs: { to: { name: "events-dashboard" } },
        permissions: [],
      });

    items1.push({
      label: "Statistics",
      icon: ChartPieIcon,
      is: "router-link",
      attrs: { to: { name: "statistics-dashboard" } },
      permissions: [],
    });

    if (store.org?.is_mail_enabled)
      items1.push({
        label: "Mail",
        icon: EnvelopeIcon,
        is: "router-link",
        attrs: {
          to: { name: "mail-dashboard" },
        },
        permissions: [],
      });

    items1.push(
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
      {
        label: "Legal",
        icon: ScaleIcon,
        notifications: store.badges?.legal,
        is: "router-link",
        attrs: { to: { name: "legal-dashboard" } },
        permissions: [],
      },
    );

    if (store.org?.is_chat_enabled)
      items1.push({
        label: "Chat (Beta)",
        icon: ChatBubbleBottomCenterTextIcon,
        is: "router-link",
        attrs: { to: { name: "chat-dashboard" } },
        permissions: [],
      });

    if (store.org?.links.length) {
      items1.push({ divider: true });
      store.org?.links.forEach((l) => {
        items1.push({
          label: l.name,
          icon: LinkIcon,
          is: "a",
          permissions: [],
          attrs: { href: l.link, target: "_blank", rel: "noopener" },
        });
      });
    }

    return items1;
  });

  return {
    navigationItems,
  };
}
