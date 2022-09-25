import { computed } from "vue";
import {
  RectangleStackIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  ChartPieIcon,
  CogIcon,
  LifebuoyIcon,
  ScaleIcon,
} from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";

export default function useNavigationItems() {
  const store = useUserStore();

  const navigationItems = computed(() => {
    const items = [
      {
        label: "Records",
        icon: RectangleStackIcon,
        link: { name: "records-dashboard" },
        permissions: [],
      },
      {
        label: "Files",
        icon: FolderOpenIcon,
        link: { name: "files-dashboard" },
        permissions: [],
      },
      {
        label: "Collab",
        icon: DocumentTextIcon,
        link: { name: "collab-dashboard" },
        permissions: [],
      },
      {
        label: "Statistics",
        icon: ChartPieIcon,
        link: { name: "statistics-dashboard" },
        permissions: [],
      },
      {
        label: "Admin",
        icon: CogIcon,
        link: { name: "admin-dashboard" },
        notifications: store.adminBadges,
        permissions: [],
      },
      {
        label: "Help",
        icon: LifebuoyIcon,
        link: { name: "help-dashboard" },
        permissions: [],
      },
    ];

    if (store.user?.email.endsWith("law-orga.de"))
      items.push({
        label: "Legal",
        icon: ScaleIcon,
        notifications: store.badges?.legal,
        link: { name: "legal-dashboard" },
        permissions: [],
      });

    return items;
  });

  return {
    navigationItems,
  };
}
