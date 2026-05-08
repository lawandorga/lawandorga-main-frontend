<script lang="ts" setup>
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import useNavigationItems, {
  NavigationItem,
} from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";
import { ref, watch } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import LogoWhite from "./LogoWhite.vue";
import { CircleLoader } from "lorga-ui";
import { storeToRefs } from "pinia";
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
</script>

<template>
  <div class="hidden md:flex md:shrink-0 print:hidden">
    <div class="flex flex-col" :class="{ 'w-64': expanded, 'w-14': !expanded }">
      <div class="flex flex-col overflow-y-auto grow bg-formcolor">
        <div
          class="flex items-center h-16 border-b shrink-0 border-white/20"
          :class="{ 'border-r': !expanded }"
        >
          <button
            class="flex items-center justify-center w-10 h-10 border border-transparent rounded cursor-pointer focus:outline-none hover:bg-gray-50/10"
            :class="{ 'mx-auto': !expanded, 'ml-2 mr-2': expanded }"
            @click="expandClicked()"
          >
            <Bars3CenterLeftIcon class="w-6 h-6 text-white" />
          </button>
        </div>
        <div
          class="flex items-center h-14 border-white/20"
          :class="{ 'px-4': expanded, 'border-b': !expanded }"
        >
          <router-link
            :to="{ name: 'start' }"
            class="flex items-center rounded hover:bg-gray-50/10"
            :class="
              expanded
                ? 'h-10 px-4 -ml-2 space-x-2'
                : 'justify-center w-10 h-10 mx-auto'
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
          class="px-4 py-3 text-white border-b border-white/20"
        >
          <div v-show="userStore.loaded">
            <div class="text-sm truncate">
              {{ userStore.org?.name }}: {{ userStore.user?.name }}
            </div>
            <div class="text-xs truncate">{{ userStore.user?.email }}</div>
          </div>
          <CircleLoader v-show="!userStore.loaded" class="text-white" />
        </div>

        <div class="flex flex-col justify-between bg-primary grow">
          <nav
            class="flex-1 pb-2 bg-primary border-white/20"
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
            <span class="block py-2 text-xs uppercase text-white/50"
              >Sponsors</span
            >
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
                  class="h-auto px-2 py-2 overflow-hidden bg-white border-2 border-gray-200 rounded-md shadow w-36"
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
                  class="w-full h-auto overflow-hidden border-2 border-gray-200 rounded-md shadow"
                />
              </a>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
