<template>
  <Menu as="div" class="ml-3 relative">
    <div>
      <MenuButton
        class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <span class="sr-only">Open user menu</span>
        <div
          class="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-800"
        >
          Me
        </div>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <MenuItem v-if="user">
          <router-link
            :to="{ name: 'admin-profile', params: { id: user.id } }"
            class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            tabindex="-1"
          >
            Profile
          </router-link>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            class="w-full text-left cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            tabindex="-1"
            @click="$store.dispatch('user/logout')"
          >
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },
  data: function () {
    return {
      open: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
  },
});
</script>
