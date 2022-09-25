<template>
  <div class="hidden md:flex md:flex-shrink-0 print:hidden">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col flex-grow overflow-y-auto bg-lorgablue">
        <div
          class="flex items-center flex-shrink-0 h-16 px-4 border-b border-white border-opacity-20"
        >
          <router-link
            :to="{ name: 'dashboard' }"
            class="flex items-center space-x-2"
          >
            <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
            <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
          </router-link>
        </div>
        <div
          class="flex-col px-4 py-3 text-white border-b border-white border-opacity-20"
        >
          <div class="truncate">
            {{ userStore.rlc?.name }}: {{ userStore.user?.name }}
          </div>
          <div class="truncate">{{ userStore.user?.email }}</div>
        </div>
        <div class="flex flex-col justify-between flex-grow bg-white">
          <nav class="flex-1 px-2 py-2 space-y-1 bg-white">
            <router-link
              v-for="item in navigationItems"
              :key="item.label"
              :to="item.link"
              active-class="text-gray-700 !bg-gray-100 hover:bg-gray-100"
              class="flex items-center justify-between py-2 pl-2 pr-3 text-sm font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
            >
              <div class="flex items-center">
                <component
                  :is="item.icon"
                  class="flex-shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500"
                />
                {{ item.label }}
              </div>
              <div
                v-if="item.notifications && item.notifications > 0"
                class="flex items-center justify-center w-6 h-6 text-sm font-bold text-red-800 bg-red-200 rounded-full"
              >
                {{ item.notifications }}
              </div>
            </router-link>
          </nav>
          <div class="flex flex-col items-start justify-center px-4 pb-4">
            <figure class="mb-3">
              <figcaption class="mb-1 text-gray-500">A project of</figcaption>
              <a href="https://rlc-deutschland.de/" target="_blank">
                <img
                  src="/rlcd.png"
                  alt="RLC Deutschland"
                  class="h-auto px-2 py-2 overflow-hidden border-2 border-gray-200 rounded-md shadow w-36"
                />
              </a>
            </figure>
            <figure>
              <figcaption class="mb-1 text-gray-500">supported by</figcaption>
              <a href="https://www.cms-stiftung.de/" target="_blank">
                <img
                  src="/sponsor-cms.jpg"
                  alt="CMS Stiftung"
                  class="w-full h-auto overflow-hidden border-2 border-gray-200 rounded-md shadow"
                />
              </a>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useNavigationItems from "@/composables/useNavigationItems";
import { useUserStore } from "@/store/user";

const { navigationItems } = useNavigationItems();
const userStore = useUserStore();
</script>
