<script lang="ts" setup>
import { Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useRoute } from "vue-router";

import NotificationBell from "@/features/calendar/components/NotificationBell.vue";
import CreateTask from "@/features/dashboard/actions/CreateTask.vue";
import { useUserStore } from "@/store/user";

import NavigationDropdown from "./NavigationDropdown.vue";

const userStore = useUserStore();

// eslint-disable-next-line no-unused-vars
defineProps<{ setOpen: (open: boolean) => void }>();

const route = useRoute();
const isInsideApp = computed(() => {
  return route.name !== "start";
});
</script>

<template>
  <div
    class="sticky top-0 z-10 flex h-16 w-full shrink-0 items-center border-b border-gray-200 bg-white px-6 shadow print:hidden"
  >
    <button
      type="button"
      class="text-formcolor flex cursor-pointer items-center justify-center focus:outline-none md:hidden"
      @click="setOpen(true)"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
    </button>
    <span
      v-if="isInsideApp"
      class="hidden text-lg font-bold text-gray-700 md:block lg:text-2xl"
    >
      Welcome {{ userStore.user?.name }}
    </span>
    <div v-else class="flex space-x-3">
      <router-link :to="{ name: 'index' }" class="flex items-center space-x-2">
        <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
        <h1 class="text-formcolor text-2xl font-bold">Law&Orga</h1>
      </router-link>
      <img
        src="/sponsor-cms.jpg"
        alt="CMS Stiftung"
        class="h-8 w-auto overflow-hidden rounded"
      />
    </div>
    <div class="ml-auto flex items-center gap-4">
      <CreateTask v-if="isInsideApp" />
      <NotificationBell v-if="isInsideApp" />
      <NavigationDropdown />
    </div>
  </div>
</template>
