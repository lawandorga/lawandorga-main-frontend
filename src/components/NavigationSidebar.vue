<template>
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col flex-grow bg-lorgablue overflow-y-auto">
        <div
          class="
            flex
            items-center
            flex-shrink-0
            px-4
            h-16
            border-b border-white border-opacity-20
          "
        >
          <router-link to="/" class="flex space-x-2 items-center">
            <img
              src="/rlc_intranet_logo.png"
              alt="Law&Orga"
              class="h-8 w-auto"
            />
            <h1 class="text-white font-bold text-2xl">Law&Orga</h1>
          </router-link>
        </div>
        <div
          class="
            flex-col
            text-white
            px-4
            py-3
            border-b border-white border-opacity-20
          "
        >
          <div>{{ user ? user.name : "" }}</div>
          <div>{{ user ? user.email : "" }}</div>
        </div>
        <div class="flex-grow flex flex-col">
          <nav class="flex-1 px-2 py-2 bg-white space-y-1">
            <router-link
              v-for="item in sidebarItems"
              :key="item.link"
              :to="item.link"
              to-active="bg-gray-100 hover:bg-gray-100 text-gray-700"
              class="
                group
                text-gray-600
                hover:bg-gray-50 hover:text-gray-900
                group
                flex
                items-center
                justify-between
                pl-2
                pr-3
                py-2
                text-sm
                font-medium
                rounded-md
              "
            >
              <div class="flex items-center">
                <svg
                  class="
                    text-gray-400
                    mr-3
                    flex-shrink-0
                    h-6
                    w-6
                    group-hover:text-gray-500
                  "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  v-html="item.icon"
                ></svg>

                {{ item.label }}
              </div>
              <div
                v-if="item.notifications > 0"
                class="
                  flex
                  items-center
                  text-sm
                  font-bold
                  justify-center
                  text-red-800
                  w-6
                  h-6
                  rounded-full
                  bg-red-200
                "
              >
                {{ item.notifications }}
              </div>
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useNavigationItems from "@/composables/useNavigationItems";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const { navigationItems } = useNavigationItems();
    const store = useStore();

    const user = computed(() => store.getters["user/user"]);

    return {
      sidebarItems: navigationItems,
      user,
    };
  },
};
</script>

<style></style>
