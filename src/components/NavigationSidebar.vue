<script lang="ts" setup>
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import { CircleLoader } from "lorga-ui";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";

import useNavigationItems, {
  NavigationItem,
} from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";

import LogoWhite from "./LogoWhite.vue";
import NavigationSidebarItem from "./NavigationSidebarItem.vue";

const { navigationItems } = useNavigationItems();
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);
const route = useRoute();
const router = useRouter();

const expanded = ref(
  userStore.getSetting("navigationExpanded", true) as boolean,
);

watch(loaded, () => {
  expanded.value = userStore.getSetting("navigationExpanded", true) as boolean;
});

const expandClicked = () => {
  expanded.value = !expanded.value;
  userStore.updateSetting("navigationExpanded", expanded.value);
  return undefined;
};

const resolveRouteToPath = (route: string | RouteLocationRaw) => {
  if (typeof route === "string") return route;
  return router.resolve(route).path;
};

const isNavigationItemActive = (item: NavigationItem): boolean => {
  if (item.is !== "router-link" || !item.attrs?.to) {
    return false;
  }

  const itemPath = resolveRouteToPath(item.attrs.to);
  const currentPath = route.path;
  return currentPath.startsWith(itemPath);
};

const lastNameInitial = computed(() => {
  const fullName = userStore.user?.name || "";
  const lastName = fullName.split(" ").slice(-1)[0] || "";
  return lastName.charAt(0).toUpperCase();
});
</script>

<template>
  <div
    class="hidden md:flex md:shrink-0 md:flex-col print:hidden"
    :class="{ 'w-64': expanded, 'w-14': !expanded }"
  >
    <div class="bg-formcolor flex grow flex-col overflow-y-auto">
      <div
        class="flex h-16 shrink-0 items-center border-b border-white/20"
        :class="{ 'border-r': !expanded }"
      >
        <button
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-transparent hover:bg-gray-50/10 focus:outline-none"
          :class="{ 'mx-auto': !expanded, 'mr-2 ml-2': expanded }"
          @click="expandClicked()"
        >
          <Bars3CenterLeftIcon class="h-6 w-6 text-white" />
        </button>
      </div>
      <div
        class="flex h-14 items-center"
        :class="{ 'px-4': expanded, 'border-b': !expanded }"
      >
        <router-link
          :to="{ name: 'start' }"
          class="flex items-center rounded hover:bg-gray-50/10"
          :class="
            expanded
              ? '-ml-2 h-10 space-x-2 px-4'
              : 'mx-auto h-10 w-10 justify-center'
          "
        >
          <div :class="{ '-ml-2': expanded }">
            <LogoWhite />
          </div>
          <h1 v-show="expanded" class="text-2xl font-bold text-white">
            Law&Orga
          </h1>
        </router-link>
      </div>
      <div
        v-show="expanded"
        class="border-b border-white/20 px-4 py-3 text-white"
      >
        <div v-show="userStore.loaded">
          <div class="truncate text-sm">
            {{ userStore.org?.name }}: {{ userStore.user?.name }}
          </div>
          <div class="truncate text-xs">{{ userStore.user?.email }}</div>
        </div>
        <CircleLoader v-show="!userStore.loaded" class="text-white" />
      </div>
      <div v-show="!expanded" class="bg-lorgablue flex h-10 w-10 items-center justify-center rounded text-lg font-bold text-white">
            {{ lastNameInitial }}
      </div>

      <div class="flex grow flex-col justify-between">
        <nav
          class="flex-1 border-white/20 pb-2"
          :class="{
            'space-y-3 pt-3': !expanded,
            'space-y-1 px-2 pt-2': expanded,
          }"
        >
          <NavigationSidebarItem
            v-for="item in navigationItems"
            :key="item.label"
            :item="item"
            :expanded="expanded"
            :active="isNavigationItemActive(item)"
          />
        </nav>
        <div
          v-show="expanded"
          class="flex flex-col items-start justify-center p-4"
        >
          <div class="py-2 text-xs text-white/50 uppercase">Sponsors</div>
          <figure class="mb-3">
            <figcaption class="mb-1 text-white/50">A project of</figcaption>
            <a
              href="https://rlc-deutschland.de/"
              rel="noopener"
              target="_blank"
            >
              <img
                src="/rlcd.png"
                alt="RLC Deutschland"
                class="h-auto w-36 overflow-hidden rounded-md border-2 border-gray-200 bg-white px-2 py-2 shadow"
              />
            </a>
          </figure>
          <figure>
            <figcaption class="mb-1 text-white/50">Supported by</figcaption>
            <a
              href="https://www.cms-stiftung.de/"
              rel="noopener"
              target="_blank"
            >
              <img
                src="/sponsor-cms.jpg"
                alt="CMS Stiftung"
                class="h-auto w-full overflow-hidden rounded-md border-2 border-gray-200 shadow"
              />
            </a>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>
