<template>
  <TableRow>
    <TableData :colspan="colspan">
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
            class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
              @click="previousPage()"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              v-for="pageNumber in pages.slice(
                Math.max(current - 5, 0),
                current + 5,
              )"
              :key="pageNumber"
              type="button"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium border hover:bg-gray-50"
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
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
              @click="nextPage()"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </TableData>
  </TableRow>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TableData, TableRow } from "@lawandorga/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    TableRow,
    TableData,
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
      type: Array as PropType<number[]>,
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
