<script lang="ts" setup>
import { computed } from "vue";
import { Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import NavigationDropdown from "./NavigationDropdown.vue";
import { useRoute } from "vue-router";
import CreateTask from "@/features/dashboard/actions/CreateTask.vue";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { Squares2X2Icon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
// eslint-disable-next-line no-unused-vars
defineProps<{ setOpen: (open: boolean) => void }>();

const route = useRoute();
const inside = computed(() => {
  return route.name !== "start";
});
</script>

<template>
  <div
    class="relative z-10 flex h-16 px-8 py-4 border-b shadow shrink-0 border-white/20 bg-white print:hidden"
  >
    <button
      type="button"
      class="flex items-center justify-center px-4 text-gray-200 border-r cursor-pointer border-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
      @click="setOpen(true)"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3BottomLeftIcon class="w-6 h-6" aria-hidden="true" />
    </button>
    <div class="flex justify-between flex-1 px-4">
      <div class="flex items-center flex-1">
        <BreadcrumbsBar
          class="lg:col-span-2 mr-4"
          :base="{ name: 'dashboard' }"
          :pages="[]"
        >
          <Squares2X2Icon class="w-6 h-6" />
        </BreadcrumbsBar>
        <h1 class="text-2xl font-bold text-gray-700">
          Welcome {{ user?.name }}
        </h1>
        <div v-show="!inside" class="flex space-x-3">
          <router-link
            :to="{ name: 'index' }"
            class="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
            <h1 class="text-2xl font-bold text-primary">Law&Orga</h1>
          </router-link>
          <div class="w-px h-8 bg-white"></div>
          <img
            src="/sponsor-cms.jpg"
            alt="CMS Stiftung"
            class="w-auto h-8 overflow-hidden rounded"
          />
        </div>
      </div>
      <div class="flex items-center ml-4 md:ml-6">
        <CreateTask />
        <NavigationDropdown />
      </div>
    </div>
  </div>
</template>
