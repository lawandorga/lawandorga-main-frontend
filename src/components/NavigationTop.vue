<template>
  <div
    class="relative z-10 flex flex-shrink-0 h-16 border-b border-white shadow bg-formcolor border-opacity-20 print:hidden"
  >
    <div
      type="button"
      class="flex items-center justify-center px-4 text-gray-200 border-r border-white cursor-pointer border-opacity-20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
      @click="setOpen(true)"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3BottomLeftIcon class="w-6 h-6" aria-hidden="true" />
    </div>
    <div class="flex justify-between flex-1 px-4">
      <div class="flex items-center flex-1">
        <div v-show="!inside" class="flex space-x-3">
          <router-link
            :to="{ name: 'index' }"
            class="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
            <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
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
        <CreateTask v-if="user?.email === 'dummy@law-orga.de'" />
        <NavigationDropdown />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import NavigationDropdown from "./NavigationDropdown.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user";
import CreateTask from "@/features/dashboard/actions/CreateTask.vue";

const userStore = useUserStore();
const { user } = userStore;

// eslint-disable-next-line no-unused-vars
defineProps<{ setOpen: (open: boolean) => void }>();

const route = useRoute();
const inside = computed(() => {
  return route.name !== "start";
});
</script>
