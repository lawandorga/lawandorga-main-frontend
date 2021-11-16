<template>
  <div
    class="
      relative
      z-10
      flex-shrink-0 flex
      h-16
      bg-lorgablue
      shadow
      border-b border-white border-opacity-20
    "
  >
    <div
      type="button"
      class="
        cursor-pointer
        flex
        items-center
        justify-center
        px-4
        border-r border-white border-opacity-20
        text-gray-200
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500
        md:hidden
      "
      @click="setOpen(true)"
    >
      <span class="sr-only">Open sidebar</span>
      <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
    </div>
    <div class="flex-1 px-6 flex justify-between">
      <div class="flex-1 flex"></div>
      <div class="ml-4 flex items-center md:ml-6">
        <router-link
          :to="{ name: 'admin-notifications' }"
          class="
            p-1
            block
            relative
            rounded-full
            text-gray-300
            hover:text-gray-200
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
        >
          <span class="sr-only">View notifications</span>
          <BellIcon class="h-6 w-6" aria-hidden="true" />
          <div
            v-if="notifications > 0"
            class="
              flex
              items-center
              text-sm
              font-bold
              justify-center
              absolute
              top-0
              text-red-800
              left-0
              transform
              translate-x-4
              -translate-y-1
              w-6
              h-6
              rounded-full
              bg-red-200
            "
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
import { BellIcon, MenuAlt2Icon } from "@heroicons/vue/outline";
import NavigationDropdown from "./NavigationDropdown.vue";

export default {
  components: {
    BellIcon,
    MenuAlt2Icon,
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

    return {
      notifications,
    };
  },
};
</script>
