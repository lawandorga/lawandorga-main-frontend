import { computed } from "vue";
import { useStore } from "vuex";
import {
  RectangleStackIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  ChartPieIcon,
  CogIcon,
  LifebuoyIcon,
} from "@heroicons/vue/24/outline";

// interface SidebarItem {
//   label: string;
//   icon: Component;
//   link: string | { name: string };
//   notifications?: number;
//   permissions: string[];
// }

export default function useNavigationItems() {
  // const navigationItems: Ref<SidebarItem[]> = ref([]);
  const store = useStore();

  // const setNavigationItems = (permissions: string[]) => {
  //   navigationItems.value = [
  //     {
  //       label: "Records",
  //       icon: RectangleStackIcon,
  //       link: { name: "records-dashboard" },
  //       permissions: [],
  //     },
  //     {
  //       label: "Files",
  //       icon: FolderOpenIcon,
  //       link: { name: "files-dashboard" },
  //       permissions: [],
  //     },
  //     {
  //       label: "Collab",
  //       icon: DocumentTextIcon,
  //       link: { name: "collab-dashboard" },
  //       permissions: [],
  //     },
  //     {
  //       label: "Statistics",
  //       icon: ChartPieIcon,
  //       link: { name: "statistics-dashboard" },
  //       permissions: [],
  //     },
  //     {
  //       label: "Admin",
  //       icon: CogIcon,
  //       link: { name: "admin-dashboard" },
  //       notifications: store.getters["user/notifications"],
  //       permissions: [],
  //     },
  //     {
  //       label: "Help",
  //       icon: LifebuoyIcon,
  //       link: { name: "help-dashboard" },
  //       permissions: [],
  //     },
  //     // {
  //     //   label: 'Imprint',
  //     //   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />',
  //     //   link: '/imprint/',
  //     // },
  //     // {
  //     //   label: 'Privacy',
  //     //   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />',
  //     //   link: 'http://rlc-deutschland.de/datenschutz/',
  //     // },
  //   ];
  // };

  // const authenticated = computed(
  //   (): boolean => store.getters["user/isAuthenticated"],
  // );

  const navigationItems = computed(() => [
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
      notifications: store.getters["user/adminNotifications"],
      permissions: [],
    },
    {
      label: "Help",
      icon: LifebuoyIcon,
      link: { name: "help-dashboard" },
      permissions: [],
    },
    // {
    //   label: 'Imprint',
    //   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />',
    //   link: '/imprint/',
    // },
    // {
    //   label: 'Privacy',
    //   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />',
    //   link: 'http://rlc-deutschland.de/datenschutz/',
    // },
  ]);

  // onMounted(() => setNavigationItems([]));
  // watch(authenticated, () => setNavigationItems([]));

  return {
    navigationItems,
  };
}
