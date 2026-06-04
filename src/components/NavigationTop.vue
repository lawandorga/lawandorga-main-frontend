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
    class="sticky top-0 z-10 flex w-full h-16 bg-white border-b shadow shrink-0 border-white/20 print:hidden"
  >
    <div class="flex items-center w-full max-w-5xl px-6 mx-auto">
      <button
        type="button"
        class="flex items-center justify-center px-4 text-gray-200 border-r cursor-pointer border-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
        @click="setOpen(true)"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3BottomLeftIcon class="w-6 h-6" aria-hidden="true" />
      </button>
      <div class="flex justify-between flex-1">
        <div class="flex items-center flex-1">
          <BreadcrumbsBar
            class="hidden mr-4 md:block"
            :base="{ name: 'dashboard' }"
            :pages="[]"
          >
            <Squares2X2Icon class="w-6 h-6" />
          </BreadcrumbsBar>
          <span
            class="hidden text-lg font-bold text-gray-700 lg:text-2xl md:block"
          >
            Welcome {{ user?.name }}
          </span>
          <div v-show="!inside" class="flex space-x-3">
            <router-link
              :to="{ name: 'index' }"
              class="flex items-center space-x-2"
            >
              <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
              <h1 class="text-2xl font-bold text-primary">Law&Orga</h1>
            </router-link>
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
  </div>
</template>
