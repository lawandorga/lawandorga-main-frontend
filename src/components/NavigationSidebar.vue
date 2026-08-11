<script lang="ts" setup>
import { Bars3CenterLeftIcon } from "@heroicons/vue/24/outline";
import { CircleLoader } from "lorga-ui";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import useNavigationItems from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";

import LogoWhite from "./LogoWhite.vue";
import NavigationSidebarItem from "./NavigationSidebarItem.vue";

const { navigationItems, externalLinks, isNavigationItemActive } =
  useNavigationItems();
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);

const expanded = ref(!!userStore.getSetting("navigationExpanded", true));

watch(loaded, () => {
  expanded.value = !!userStore.getSetting("navigationExpanded", true);
});

const toggleExpanded = () => {
  expanded.value = !expanded.value;
  userStore.updateSetting("navigationExpanded", expanded.value);
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
    <div class="bg-formcolor flex grow flex-col overflow-hidden">
      <div
        class="flex h-16 shrink-0 items-center border-b border-white/20"
        :class="{ 'border-r': !expanded }"
      >
        <button
          type="button"
          :aria-label="expanded ? 'Collapse navigation' : 'Expand navigation'"
          :aria-expanded="expanded"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-transparent hover:bg-gray-50/10 focus:outline-none"
          :class="{ 'mx-auto': !expanded, 'mr-2 ml-2': expanded }"
          @click="toggleExpanded()"
        >
          <Bars3CenterLeftIcon aria-hidden="true" class="h-6 w-6 text-white" />
        </button>
      </div>
      <div class="flex shrink-0 items-center py-2">
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
        class="flex shrink-0 items-center border-b border-white/20 text-white"
        :class="{ 'px-4 pb-4': expanded, 'justify-center pb-3': !expanded }"
      >
        <template v-if="expanded">
          <div v-show="userStore.loaded">
            <div class="truncate text-sm">
              {{ userStore.org?.name }}: {{ userStore.user?.name }}
            </div>
            <div class="truncate text-xs text-white/50">
              {{ userStore.user?.email }}
            </div>
          </div>
          <CircleLoader v-show="!userStore.loaded" class="text-white" />
        </template>
        <div
          v-else
          class="flex h-10 w-10 items-center justify-center rounded bg-white/10 text-lg font-bold"
        >
          {{ lastNameInitial }}
        </div>
      </div>

      <nav
        aria-label="Main"
        class="flex-1 space-y-1 overflow-y-auto py-2"
        :class="{ 'px-2': expanded }"
      >
        <NavigationSidebarItem
          v-for="item in navigationItems"
          :key="item.label"
          :item="item"
          :expanded="expanded"
          :active="isNavigationItemActive(item)"
        />
      </nav>

      <nav
        v-if="externalLinks.length"
        aria-label="External links"
        class="shrink-0 space-y-1 border-t border-white/20 py-2"
        :class="{ 'px-2': expanded }"
      >
        <span
          v-show="expanded"
          class="block px-2 text-xs text-white/50 uppercase"
        >
          External Links
        </span>
        <NavigationSidebarItem
          v-for="link in externalLinks"
          :key="link.label"
          :item="link"
          :expanded="expanded"
        />
      </nav>

      <div
        v-show="expanded"
        class="flex shrink-0 flex-col items-start justify-center border-t border-white/20 px-4 pt-2 pb-4"
      >
        <div class="py-2 text-xs text-white/50 uppercase">Sponsors</div>
        <figure class="mb-3">
          <figcaption class="mb-1 text-white/50">A project of</figcaption>
          <a href="https://rlc-deutschland.de/" rel="noopener" target="_blank">
            <img
              src="/rlcd.png"
              alt="RLC Deutschland"
              class="h-auto w-36 overflow-hidden rounded-md border-2 border-gray-200 bg-white px-2 py-2 shadow"
            />
          </a>
        </figure>
        <figure>
          <figcaption class="mb-1 text-white/50">Supported by</figcaption>
          <a href="https://www.cms-stiftung.de/" rel="noopener" target="_blank">
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
</template>
