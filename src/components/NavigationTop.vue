<template>
  <div
    class="relative z-10 flex flex-shrink-0 h-16 border-b border-white shadow bg-lorgablue border-opacity-20 print:hidden"
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
        <router-link
          v-if="false"
          :to="{ name: 'admin-notifications' }"
          class="relative block p-1 text-gray-300 rounded-full hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <span class="sr-only">View notifications</span>
          <BellIcon class="w-6 h-6" aria-hidden="true" />
          <div
            v-if="notifications > 0"
            class="absolute top-0 left-0 flex items-center justify-center w-6 h-6 text-sm font-bold text-red-800 transform translate-x-4 -translate-y-1 bg-red-200 rounded-full"
          >
            {{ notifications }}
          </div>
        </router-link>

        <NavigationDropdown />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { BellIcon, Bars3BottomLeftIcon } from "@heroicons/vue/24/outline";
import NavigationDropdown from "./NavigationDropdown.vue";
import { useRoute } from "vue-router";

export default {
  components: {
    BellIcon,
    Bars3BottomLeftIcon,
    NavigationDropdown,
  },
  props: {
    setOpen: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const notifications = computed(() => 0);

    const route = useRoute();
    const inside = computed(() => {
      return route.name !== "start";
    });

    return {
      notifications,
      inside,
    };
  },
};
</script>
