<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="flex text-sm bg-gray-100 rounded-full focus:outline-none ring-gray-100 ring-2 hover:ring-gray-200 focus:ring-gray-200 focus:ring-2"
      >
        <span class="sr-only">Oepn user menu</span>
        <div class="relative overflow-hidden rounded-full h-7 w-7">
          <UserIcon
            class="transform scale-110 w-full h-full text-blue-700 absolute -bottom-0.5 left-0 right-0"
          />
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
        <MenuItem v-if="userStore.user">
          <RouterLink
            :to="{ name: 'admin-profile', params: { id: userStore.user.id } }"
            class="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            Profile
          </RouterLink>
        </MenuItem>
        <MenuItem v-if="userStore.user">
          <RouterLink
            :to="{ name: 'user-keys' }"
            class="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            Keys
          </RouterLink>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            class="block w-full px-4 py-2 text-sm text-left text-gray-700 cursor-pointer hover:bg-gray-100"
            @click="logout()"
          >
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useUserStore } from "@/store/user";
import { UserIcon } from "@heroicons/vue/20/solid";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push({ name: "start" });
};
</script>
