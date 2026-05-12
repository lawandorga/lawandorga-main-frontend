<script lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { TableData, TableRow } from "lorga-ui";
import { defineComponent, PropType } from "vue";

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

<template>
  <TableRow>
    <TableData :colspan="colspan" class="md:pr-0!">
      <div class="flex flex-1 items-center justify-between">
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
        <div class="right-0 md:sticky md:pr-6">
          <nav
            class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              class="relative inline-flex items-center border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              :class="{
                'z-10 border-blue-500 bg-blue-50 text-blue-600':
                  pageNumber === current,
                'border-gray-300 bg-white text-gray-500':
                  pageNumber !== current,
              }"
              @click="setPage(pageNumber)"
            >
              {{ pageNumber }}
            </button>
            <button
              type="button"
              class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              @click="nextPage()"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </TableData>
  </TableRow>
</template>
