<template>
  <div>
    <div class="flex h-screen overflow-hidden print:h-auto print:overflow-auto">
      <NavigationMobile :open="menuOpen" :set-open="setMenuOpen" />

      <NavigationSidebar v-if="userStore.isAuthenticated && inside" />

      <div class="flex flex-col flex-1 w-0 overflow-hidden">
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
          <!-- <br class="h-6" /> -->
          Please let us know if you need to access Law&Orga during this time at
          it@law-orga.de to reschedule.
        </div>

        <NavigationDefault v-if="!userStore.isAuthenticated" />

        <!-- Main Panel -->
        <main
          class="relative flex-1 px-6 py-6 overflow-y-auto focus:outline-none"
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
import { AlertList } from "@lawandorga/components";
import NavigationSidebar from "./components/NavigationSidebar.vue";
import NavigationTop from "./components/NavigationTop.vue";
import NavigationMobile from "./components/NavigationMobile.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./store/user";
import { useAlertStore } from "./store/alert";
import BannerList from "./components/BannerList.vue";
import { getCookie } from "./utils/cookie";

if (!getCookie("csrftoken")) {
  const redirect = `${window.location.origin}/user/register`;
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
