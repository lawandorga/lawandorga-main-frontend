<script lang="ts" setup>
import { Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import { Squares2X2Icon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import CreateTask from "@/features/dashboard/actions/CreateTask.vue";
import { useUserStore } from "@/store/user";

import NavigationDropdown from "./NavigationDropdown.vue";
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
    class="sticky top-0 z-10 flex h-16 w-full shrink-0 border-b border-white/20 bg-white shadow print:hidden"
  >
    <div class="mx-auto flex w-full max-w-5xl items-center px-6">
      <button
        type="button"
        class="flex cursor-pointer items-center justify-center border-r border-white/20 px-4 text-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none focus:ring-inset md:hidden"
        @click="setOpen(true)"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex flex-1 justify-between">
        <div class="flex flex-1 items-center">
          <BreadcrumbsBar
            v-show="inside"
            class="mr-4 hidden md:block"
            :base="{ name: 'dashboard' }"
            :pages="[]"
          >
            <Squares2X2Icon class="h-6 w-6" />
          </BreadcrumbsBar>
          <span
            class="hidden text-lg font-bold text-gray-700 md:block lg:text-2xl"
            v-show="inside"
          >
            Welcome {{ user?.name }}
          </span>
          <div v-show="!inside" class="flex space-x-3">
            <router-link
              :to="{ name: 'index' }"
              class="flex items-center space-x-2"
            >
              <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
              <h1 class="text-formcolor text-2xl font-bold">Law&Orga</h1>
            </router-link>
            <img
              src="/sponsor-cms.jpg"
              alt="CMS Stiftung"
              class="h-8 w-auto overflow-hidden rounded"
            />
          </div>
        </div>
        <div class="ml-4 flex items-center md:ml-6">
          <CreateTask v-show="inside" />
          <NavigationDropdown />
        </div>
      </div>
    </div>
  </div>
</template>
