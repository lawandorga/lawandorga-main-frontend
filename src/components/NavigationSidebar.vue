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
import RedBadge from "./RedBadge.vue";

const { navigationItems } = useNavigationItems();
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);
const route = useRoute();
const router = useRouter();

const expanded = ref(userStore.getSetting("navigationExpanded", true));

watch(loaded, () => {
  expanded.value = userStore.getSetting("navigationExpanded", true);
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
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded hover:bg-gray-50/10 focus:outline-none"
          :class="{ 'mx-auto': !expanded, 'mr-2 ml-2': expanded }"
          @click="expandClicked()"
        >
          <Bars3CenterLeftIcon class="h-6 w-6 text-white" />
        </button>
      </div>
      <div class="flex h-14 shrink-0 items-center border-b border-white/20">
        <router-link
          :to="{ name: 'start' }"
          class="ml-1.5 flex h-10 items-center gap-2 rounded px-2 hover:bg-gray-50/10"
        >
          <LogoWhite />
          <h1 v-show="expanded" class="text-2xl font-bold text-white">
            Law&Orga
          </h1>
        </router-link>
      </div>
      <div
        class="flex h-16 shrink-0 items-center border-b border-white/20"
        :class="{ 'px-4': expanded, 'justify-center': !expanded }"
      >
        <template v-if="expanded">
          <div v-show="userStore.loaded">
            <div class="truncate text-white">
              {{ userStore.org?.name }}: {{ userStore.user?.name }}
            </div>
            <div class="truncate text-sm text-white">
              {{ userStore.user?.email }}
            </div>
          </div>
          <CircleLoader v-show="!userStore.loaded" class="text-white" />
        </template>
        <template v-else>
          <div
            class="bg-lorgablue flex h-10 w-10 items-center justify-center rounded text-lg font-bold text-white"
          >
            {{ lastNameInitial }}
          </div>
        </template>
      </div>

      <div class="flex grow flex-col justify-between bg-white">
        <nav
          class="flex flex-1 flex-col gap-1 pt-3 pb-2"
          :class="{ 'px-2': expanded }"
        >
          <template v-for="item in navigationItems" :key="item.label">
            <div v-if="item.divider">
              <div
                :class="{
                  'w-full py-4': expanded,
                  'mx-auto w-10 py-0.5': !expanded,
                }"
              >
                <div
                  class="w-full border-t"
                  :class="{
                    'border-gray-100': expanded,
                    'border-gray-300': !expanded,
                  }"
                ></div>
              </div>
            </div>
            <component
              :is="item.is"
              v-else
              v-bind="item.attrs"
              class="group relative flex items-center justify-between rounded-md py-2 pl-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{
                'bg-gray-100! text-gray-700 hover:bg-gray-100':
                  isNavigationItemActive(item),
                'pb-5.5!': !expanded && item.is === 'a',
                'mx-auto w-10 pr-2': !expanded,
                'pr-3': expanded,
              }"
            >
              <div class="flex items-center">
                <component
                  :is="item.icon"
                  class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                  :class="{ 'mr-3': expanded }"
                />
                <span
                  v-show="expanded || item.is === 'a'"
                  :class="{
                    'absolute top-8 right-0 left-0 block truncate text-center text-xs text-gray-500':
                      !expanded,
                  }"
                >
                  {{ item.label }}
                </span>
              </div>
              <RedBadge
                v-if="item.notifications && item.notifications > 0"
                :additional-classes="
                  expanded ? '' : 'absolute top-1 right-1 w-4! h-4! text-xs!'
                "
              >
                {{ item.notifications }}
              </RedBadge>
            </component>
          </template>
        </nav>
        <div
          v-show="expanded"
          class="flex flex-col items-start justify-center px-4 pb-4"
        >
          <figure class="mb-3">
            <figcaption class="mb-1 text-gray-500">A project of</figcaption>
            <a
              href="https://rlc-deutschland.de/"
              rel="noopener"
              target="_blank"
            >
              <img
                src="/rlcd.png"
                alt="RLC Deutschland"
                class="h-auto w-36 overflow-hidden rounded-md border-2 border-gray-200 px-2 py-2 shadow"
              />
            </a>
          </figure>
          <figure>
            <figcaption class="mb-1 text-gray-500">supported by</figcaption>
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
