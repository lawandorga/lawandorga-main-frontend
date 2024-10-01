<template>
  <div>
    <div class="flex h-screen overflow-hidden print:h-auto print:overflow-auto">
      <NavigationMobile :open="menuOpen" :set-open="setMenuOpen" />

      <NavigationSidebar v-if="userStore.isAuthenticated && inside" />

      <div class="flex flex-col flex-1 w-0 overflow-hidden print:block">
        <NavigationTop
          v-if="userStore.isAuthenticated"
          :set-open="setMenuOpen"
        />

        <div
          v-if="false"
          class="px-5 py-2 font-bold text-center text-orange-900 bg-orange-300"
        >
          Law&Orga will be updated today 16:00 - 19:00 (Berlin Time). During
          this time, you will not be able to login and you will be logged out
          automatically at 16:00.
          <br />
          Please let us know if you need to access Law&Orga during this time at
          it@law-orga.de to reschedule.
        </div>

        <NavigationDefault v-if="!userStore.isAuthenticated" />

        <!-- Main Panel -->
        <main
          class="relative flex-1 px-6 py-6 overflow-x-hidden overflow-y-auto focus:outline-none print:p-0"
        >
          <router-view></router-view>
        </main>
      </div>
    </div>
    <AlertList
      :alerts="alertStore.alerts"
      @close="alertStore.closeAlert($event)"
    />
    <BannerList v-if="userStore.loaded" />
  </div>
</template>

<script lang="ts" setup>
import NavigationDefault from "@/components/NavigationDefault.vue";
import { ref, computed } from "vue";
import { AlertList, useConfig } from "lorga-ui";
import NavigationSidebar from "./components/NavigationSidebar.vue";
import NavigationTop from "./components/NavigationTop.vue";
import NavigationMobile from "./components/NavigationMobile.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./store/user";
import { useAlertStore } from "./store/alert";
import BannerList from "./components/BannerList.vue";
import { getCookie } from "./utils/cookie";

const { overwrite } = useConfig();
overwrite(
  "table.td",
  "px-6 py-4 text-base text-gray-500 bg-white overflow-hidden text-ellipsis",
);
overwrite("table.table", "min-w-full divide-y divide-gray-200 w-fit");
overwrite(
  "table.th",
  "h-16 px-6 text-base font-semibold text-left text-zinc-700 bg-gray-50 whitespace-nowrap",
);
overwrite(
  "table.tdAction",
  "md:sticky right-0 gap-5 flex items-center md:!border-l-0",
);
overwrite(
  "button.primary.size",
  "text-base font-semibold px-4 py-2.5 rounded-lg drop-shadow",
);
overwrite(
  "button.secondary.size",
  "text-base font-semibold px-4 py-2.5 rounded-lg drop-shadow",
);
overwrite(
  "button.link.size",
  "text-base font-semibold px-4 py-2.5 rounded-lg drop-shadow",
);
overwrite(
  "button.link.color",
  "text-formcolor hover:bg-blue-50 border border-solid border-transparent focus:border-[#ABD0DA]",
);
overwrite(
  "button.outline.color",
  "outline-zinc-400 outline-1 outline shadow-md text-zinc-600",
);
overwrite("button.outline.size", "rounded p-2 font-semibold");

if (!getCookie("csrftoken")) {
  const redirect = window.location.href;
  const redirectEncoded = encodeURIComponent(redirect);
  const backend = import.meta.env.VITE_AUTH_URL;
  const cookieSetLink = `${backend}/redirect/?next=${redirectEncoded}`;
  window.location.assign(cookieSetLink);
}

const alertStore = useAlertStore();

const route = useRoute();

const menuOpen = ref(false);

const userStore = useUserStore();

const inside = computed<boolean>(() => {
  return route.name !== "start";
});

const setMenuOpen = (open: boolean) => {
  menuOpen.value = open;
};
</script>

<style>
@media print {
  ::-webkit-scrollbar {
    display: none;
  }
  html,
  body {
    font-size: 95%;
  }
}
</style>
