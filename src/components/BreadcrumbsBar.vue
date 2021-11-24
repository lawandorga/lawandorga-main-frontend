<template>
  <nav
    class="
      flex flex-col
      items-start
      space-y-6
      lg:space-y-0 lg:flex-row lg:justify-between
    "
    aria-label="Breadcrumb"
  >
    <ol role="list" class="bg-white rounded-md shadow-sm px-6 flex space-x-4">
      <li class="flex h-11">
        <div class="flex items-center">
          <router-link :to="base" class="text-gray-400 hover:text-gray-500">
            <div class="flex-shrink-0">
              <slot />
            </div>
            <span class="sr-only">Start</span>
          </router-link>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name" class="flex h-11">
        <div class="flex items-center">
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
            class="text-sm ml-4 font-medium text-gray-500 hover:text-gray-700"
          >
            {{ page.name }}
          </router-link>
        </div>
      </li>
    </ol>
    <div class="flex space-x-3">
      <slot name="buttons" />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteParams } from "vue-router";

interface LocationAsName {
  name: string;
  params?: RouteParams;
}

export default defineComponent({
  components: {},
  props: {
    pages: {
      type: Array as PropType<{ name: string; to: LocationAsName }[]>,
      default: () => [],
    },
    base: {
      type: Object as PropType<{ name: string; to: LocationAsName }>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
