<template>
  <Tr>
    <Td :colspan="colspan">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            {{ " " }}
            <span class="font-medium">
              {{ start }}
            </span>
            {{ " " }}
            to
            {{ " " }}
            <span class="font-medium">
              {{ end }}
            </span>
            {{ " " }}
            of
            {{ " " }}
            <span class="font-medium">{{ total }}</span>
            {{ " " }}
            {{ name }}
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              @click="previousPage()"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              v-for="pageNumber in pages.slice(
                Math.max(current - 5, 0),
                current + 5,
              )"
              :key="pageNumber"
              type="button"
              class="hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              :class="{
                'z-10 bg-blue-50 border-blue-500 text-blue-600':
                  pageNumber === current,
                'bg-white border-gray-300 text-gray-500':
                  pageNumber !== current,
              }"
              @click="setPage(pageNumber)"
            >
              {{ pageNumber }}
            </button>
            <button
              type="button"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              @click="nextPage()"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </Td>
  </Tr>
</template>

<script lang="ts">
import Td from "./TableData.vue";
import Tr from "./TableRow.vue";
import { defineComponent } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    Tr,
    Td,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  props: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    pages: {
      type: Array,
      required: true,
    },
    colspan: {
      type: Number,
      required: true,
    },
    previousPage: {
      type: Function,
      required: true,
    },
    setPage: {
      type: Function,
      required: true,
    },
    nextPage: {
      type: Function,
      required: true,
    },
    name: {
      type: String,
      default: "objects",
    },
  },
});
</script>
