<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <span class="sr-only">Open user menu</span>
        <div
          class="flex items-center justify-center w-8 h-8 text-gray-800 bg-gray-100 rounded-full"
        >
          Me
        </div>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <MenuItem v-if="user">
          <router-link
            :to="{ name: 'admin-profile', params: { id: user.id } }"
            class="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            Profile
          </router-link>
        </MenuItem>
        <MenuItem v-if="user">
          <router-link
            :to="{ name: 'user-keys' }"
            class="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            Keys
          </router-link>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            class="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
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
