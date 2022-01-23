<template>
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col flex-grow bg-lorgablue overflow-y-auto">
        <div
          class="flex items-center flex-shrink-0 px-4 h-16 border-b border-white border-opacity-20"
        >
          <router-link to="/" class="flex space-x-2 items-center">
            <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
            <h1 class="text-white font-bold text-2xl">Law&Orga</h1>
          </router-link>
        </div>
        <div
          class="flex-col text-white px-4 py-3 border-b border-white border-opacity-20"
        >
          <div>{{ user ? user.name : "" }}</div>
          <div>{{ user ? user.email : "" }}</div>
        </div>
        <div class="flex-grow flex flex-col justify-between bg-white">
          <nav class="flex-1 px-2 py-2 bg-white space-y-1">
            <router-link
              v-for="item in sidebarItems"
              :key="item.link"
              :to="item.link"
              active-class="bg-gray-100 hover:bg-gray-100 text-gray-700"
              class="group text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center justify-between pl-2 pr-3 py-2 text-sm font-medium rounded-md"
            >
              <div class="flex items-center">
                <component
                  :is="item.icon"
                  class="text-gray-400 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-gray-500"
                />
                {{ item.label }}
              </div>
              <div
                v-if="item.notifications > 0"
                class="flex items-center text-sm font-bold justify-center text-red-800 w-6 h-6 rounded-full bg-red-200"
              >
                {{ item.notifications }}
              </div>
            </router-link>
          </nav>
          <div class="pb-4 px-4 flex flex-col justify-center items-start">
            <figure class="mb-3">
              <figcaption class="text-gray-500 mb-1">A project of</figcaption>
              <img
                src="/rlcd.png"
                alt="RLC Deutschland"
                class="h-auto px-2 py-2 w-36 rounded-md overflow-hidden border-2 border-gray-200 shadow"
              />
            </figure>
            <figure>
              <figcaption class="text-gray-500 mb-1">supported by</figcaption>
              <a href="https://www.cms-stiftung.de/" target="_blank">
                <img
                  src="/sponsor-cms.jpg"
                  alt="CMS Stiftung"
                  class="h-auto w-full rounded-md overflow-hidden border-2 border-gray-200 shadow"
                />
              </a>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useNavigationItems from "@/composables/useNavigationItems";
import { useStore } from "vuex";
import { computed } from "vue";
import UserService from "@/services/user";

export default {
  setup() {
    const { navigationItems } = useNavigationItems();
    const store = useStore();

    UserService.admin().then((admin) => store.dispatch("user/setAdmin", admin));

    const user = computed(() => store.getters["user/user"]);

    return {
      sidebarItems: navigationItems,
      user,
    };
  },
};
</script>

<style></style>
