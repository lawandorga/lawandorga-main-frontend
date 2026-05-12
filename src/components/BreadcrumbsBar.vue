<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";
import { RouteParams } from "vue-router";

interface LocationAsName {
  name: string;
  params?: RouteParams;
}

defineProps<{
  pages?: { name: string; to: LocationAsName }[];
  base: LocationAsName;
}>();
</script>

<template>
  <nav
    class="flex flex-col items-start lg:flex-row lg:justify-between lg:space-y-0 print:hidden"
    aria-label="Breadcrumb"
  >
    <div class="flex items-center space-x-2">
      <button
        class="flex h-11 items-center rounded-md bg-gray-50 px-4 text-gray-400 shadow-sm hover:text-gray-500"
        @click="$router.back()"
      >
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
      <ol class="flex rounded-md bg-gray-50 shadow-sm">
        <li class="flex h-11">
          <router-link
            :to="base"
            class="flex items-center pr-4 pl-6 text-gray-400 hover:text-gray-500"
          >
            <div class="shrink-0">
              <slot />
            </div>
            <span class="sr-only">Start</span>
          </router-link>
        </li>
        <li v-for="page in pages" :key="page.name" class="flex h-11">
          <div class="flex">
            <svg
              class="h-full w-6 shrink-0 text-gray-200"
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
            <router-link
              :to="page.to"
              class="flex h-11 items-center pr-6 pl-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {{ page.name }}
            </router-link>
          </div>
        </li>
      </ol>
    </div>
    <div class="children:mt-6 flex space-x-3">
      <slot name="buttons" />
    </div>
  </nav>
</template>

<style lang="postcss">
.children\:mt-6 > * {
  @apply mt-6 lg:mt-0;
}
</style>
