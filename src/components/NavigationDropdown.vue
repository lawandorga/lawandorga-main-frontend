<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { UserIcon } from "@heroicons/vue/20/solid";

import { useUserStore } from "@/store/user";
import { getCookie } from "@/utils/cookie";

import NavigationDropdownCloser from "./NavigationDropdownCloser.vue";

const userStore = useUserStore();

const backendLogoutUrl = `${import.meta.env.VITE_AUTH_URL}/auth/user/logout/`;
const mfaSetupUrl = `${import.meta.env.VITE_AUTH_URL}/auth/mfa/status/`;
const csrfCookie = getCookie("csrftoken");
</script>

<template>
  <Menu ref="menu" v-slot="{ close }" as="div" class="relative ml-3">
    <NavigationDropdownCloser :close="close" />
    <div>
      <MenuButton
        class="flex cursor-pointer rounded-full bg-gray-100 text-sm ring-2 ring-gray-100 hover:ring-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none"
      >
        <span class="sr-only">Open user menu</span>
        <div class="relative h-7 w-7 overflow-hidden rounded-full">
          <UserIcon
            class="absolute right-0 -bottom-0.5 left-0 h-full w-full scale-110 transform text-blue-700"
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
        class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <MenuItem v-if="userStore.user">
          <RouterLink
            :to="{ name: 'admin-profile', params: { id: userStore.user.id } }"
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </RouterLink>
        </MenuItem>
        <MenuItem v-if="userStore.user">
          <RouterLink
            :to="{ name: 'user-optimize' }"
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Optimize
          </RouterLink>
        </MenuItem>
        <MenuItem v-if="userStore.user">
          <a
            :href="mfaSetupUrl"
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            rel="noopener"
          >
            Multi-factor Authentication
          </a>
        </MenuItem>
        <MenuItem v-if="userStore.user">
          <RouterLink
            :to="{ name: 'user-keys' }"
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Keys
          </RouterLink>
        </MenuItem>
        <MenuItem>
          <form method="post" :action="backendLogoutUrl">
            <input
              type="hidden"
              name="csrfmiddlewaretoken"
              :value="csrfCookie"
            />
            <button
              type="submit"
              class="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </form>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
