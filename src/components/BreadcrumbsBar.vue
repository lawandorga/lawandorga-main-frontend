<template>
  <nav
    class="flex flex-col items-start lg:space-y-0 lg:flex-row lg:justify-between print:hidden"
    aria-label="Breadcrumb"
  >
    <div class="flex items-center space-x-2">
      <button
        class="flex items-center px-4 text-gray-400 rounded-md shadow-sm bg-gray-50 hover:text-gray-500 h-11"
        @click="$router.back()"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <ol class="flex rounded-md shadow-sm bg-gray-50">
        <li class="flex h-11">
          <router-link
            :to="base"
            class="flex items-center pl-6 pr-4 text-gray-400 hover:text-gray-500"
          >
            <div class="flex-shrink-0">
              <slot />
            </div>
            <span class="sr-only">Start</span>
          </router-link>
        </li>
        <li v-for="page in pages" :key="page.name" class="flex h-11">
          <div class="flex">
            <svg
              class="flex-shrink-0 w-6 h-full text-gray-200"
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
              class="flex items-center pl-4 pr-6 text-sm font-medium text-gray-500 hover:text-gray-700 h-11"
            >
              {{ page.name }}
            </router-link>
          </div>
        </li>
      </ol>
    </div>
    <div class="flex space-x-3 children:mt-6">
      <slot name="buttons" />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteParams } from "vue-router";
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";

interface LocationAsName {
  name: string;
  params?: RouteParams;
}

export default defineComponent({
  components: {
    ChevronLeftIcon,
  },
  props: {
    pages: {
      type: Array as PropType<{ name: string; to: LocationAsName }[]>,
      default: () => [],
    },
    base: {
      type: Object as PropType<LocationAsName>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="postcss">
.children\:mt-6 > * {
  @apply mt-6 lg:mt-0;
}
</style>
