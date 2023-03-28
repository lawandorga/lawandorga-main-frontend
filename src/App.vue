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
          v-if="updating"
          class="px-5 py-2 font-bold leading-none text-center text-orange-900 bg-orange-300"
        >
          Updates in progress. Errors can happen. We will be back to normal
          functionality in a moment.
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
// import { getUpdateStatus } from "./services/other";
import { useUserStore } from "./store/user";
import { useAlertStore } from "./store/alert";
import BannerList from "./components/BannerList.vue";

const alertStore = useAlertStore();

const route = useRoute();

const updating = ref(false);
const menuOpen = ref(false);

const userStore = useUserStore();

const inside = computed<boolean>(() => {
  return route.name !== "start";
});

const setMenuOpen = (open: boolean) => {
  menuOpen.value = open;
};

// const setUpdateStatus = () => {
//   getUpdateStatus()
//     .then((d) => (updating.value = d.updating))
//     .catch(() => {
//       /*ignore*/
//     });
//   setTimeout(() => setUpdateStatus(), 60000);
// };
// setUpdateStatus();
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
