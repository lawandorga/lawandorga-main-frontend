<script lang="ts" setup>
import { Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useRoute } from "vue-router";

import CreateTask from "@/features/dashboard/actions/CreateTask.vue";

import NavigationDropdown from "./NavigationDropdown.vue";

// eslint-disable-next-line no-unused-vars
defineProps<{ setOpen: (open: boolean) => void }>();

const route = useRoute();
const inside = computed(() => {
  return route.name !== "start";
});
</script>

<template>
  <div
    class="bg-formcolor relative z-10 flex h-16 shrink-0 border-b border-white/20 shadow print:hidden"
  >
    <button
      type="button"
      class="flex cursor-pointer items-center justify-center border-r border-white/20 px-4 text-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none focus:ring-inset md:hidden"
      @click="setOpen(true)"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
    </button>
    <div class="flex flex-1 justify-between px-4">
      <div class="flex flex-1 items-center">
        <div v-show="!inside" class="flex space-x-3">
          <router-link
            :to="{ name: 'index' }"
            class="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
            <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
          </router-link>
          <div class="h-8 w-px bg-white"></div>
          <img
            src="/sponsor-cms.jpg"
            alt="CMS Stiftung"
            class="h-8 w-auto overflow-hidden rounded"
          />
        </div>
      </div>
      <div class="ml-4 flex items-center md:ml-6">
        <CreateTask />
        <NavigationDropdown />
      </div>
    </div>
  </div>
</template>
