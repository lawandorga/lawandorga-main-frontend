<script lang="ts" setup>
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import useNavigationItems, {
  NavigationItem,
} from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";
import { ref, watch, computed } from "vue";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import LogoWhite from "./LogoWhite.vue";
import { CircleLoader } from "lorga-ui";
import { storeToRefs } from "pinia";
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

// Compute initial from the last word of the user's name
const lastNameInitial = computed(() => {
  const fullName = userStore.user?.name || "";
  const lastName = fullName.split(" ").slice(-1)[0] || "";
  return lastWord.charAt(0).toUpperCase();
});
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
          v-show="expanded"
          class="flex items-center px-4 py-1 border-b h-14 border-white/20"
        >
          <router-link
            :to="{ name: 'start' }"
            class="flex items-center h-10 px-4 -ml-2 space-x-2 rounded hover:bg-gray-50/10"
          >
            <div class="-ml-2">
              <LogoWhite />
            </div>
            <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
          </router-link>
        </div>
        <div
          v-show="!expanded"
          class="flex items-center border-b h-14 border-white/20"
        >
          <router-link
            :to="{ name: 'start' }"
            class="flex items-center justify-center w-10 h-10 mx-auto rounded hover:bg-gray-50/10"
          >
            <LogoWhite />
          </router-link>
        </div>
        <div
          v-show="expanded"
          class="px-4 py-3 text-white border-b border-white/20 bg-lorgablue"
        >
          <div v-show="userStore.loaded">
            <div class="truncate">
              {{ userStore.org?.name }}: {{ userStore.user?.name }}
            </div>
            <div class="truncate">{{ userStore.user?.email }}</div>
          </div>
          <CircleLoader v-show="!userStore.loaded" class="text-white" />
        </div>

        <!-- Collapsed account initial field -->
        <div
          v-show="!expanded"
          class="flex items-center justify-center h-14 border-b border-white/20 bg-lorgablue text-white font-bold text-lg"
        >
          {{ lastNameInitial }}
        </div>

        <div class="flex flex-col justify-between bg-white grow">
          <!-- Navigation items container with consistent spacing -->
          <nav
            class="flex-1 pb-2 bg-white"
            :class="{
              'space-y-3 pt-3': !expanded,
              'space-y-1 px-2 pt-2': expanded,
            }"
          >
            <template v-for="item in navigationItems" :key="item.label">
              <div v-if="item.divider">
                <div
                  class=""
                  :class="{
                    'w-full py-4': expanded,
                    'w-10 py-0.5 mx-auto': !expanded,
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
                class="relative flex items-center justify-between py-2 pl-2 text-sm font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
                :class="{
                  'text-gray-700 bg-gray-100! hover:bg-gray-100':
                    isNavigationItemActive(item),
                  'pb-5.5!': !expanded && item.is === 'a',
                  'w-10 pr-2 mx-auto': !expanded,
                  'pr-3': expanded,
                }"
              >
                <div class="flex items-center">
                  <component
                    :is="item.icon"
                    class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-gray-500"
                    :class="{ 'mr-3': expanded }"
                  />
                  <span
                    v-show="expanded || item.is === 'a'"
                    :class="{
                      'text-xs absolute block bold top-8 truncate left-0 right-0 text-center text-gray-500':
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
                  class="h-auto px-2 py-2 overflow-hidden border-2 border-gray-200 rounded-md shadow w-36"
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
