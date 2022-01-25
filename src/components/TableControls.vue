<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item.key">
          <slot :name="`head-${item.key}`">
            <div class="flex items-center justify-between">
              {{ item.name }}
            </div>
          </slot>
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      <template v-if="data !== null">
        <Tr
          v-for="(dataItem, index) in data.slice(start - 1, end)"
          :key="index"
          class="divide-x divide-gray-100"
        >
          <Td v-for="headItem in head" :key="headItem.key">
            <slot
              :dataItem="dataItem"
              :headItem="headItem"
              :name="headItem.key"
            >
              {{ getData(dataItem, headItem.key) }}
            </slot>
          </Td>
        </Tr>
      </template>
      <Tr v-show="innerLoading">
        <Td :colspan="head.length">
          <CircleLoader />
        </Td>
      </Tr>
      <Tr>
        <Td :colspan="head.length">
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
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
                records
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
                  @click="page = Math.max(page - 1, 1)"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  v-for="pageNumber in pages.slice(
                    Math.max(page - 5, 0),
                    page + 5,
                  )"
                  :key="pageNumber"
                  type="button"
                  class="hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  :class="{
                    'z-10 bg-blue-50 border-blue-500 text-blue-600':
                      pageNumber === page,
                    'bg-white border-gray-300 text-gray-500':
                      pageNumber !== page,
                  }"
                  @click="page = pageNumber"
                >
                  {{ pageNumber }}
                </button>
                <button
                  type="button"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  @click="page = Math.min(page + 1, pages.length)"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </Td>
      </Tr>
    </Tbody>
  </Table>
</template>

<script lang="ts">
import Table from "./TableTable.vue";
import Td from "./TableData.vue";
import Tbody from "./TableBody.vue";
import Thead from "./TableHeader.vue";
import Tr from "./TableRow.vue";
import Th from "./TableHead.vue";
import { defineComponent, PropType } from "vue";
import { JsonModel } from "@/types/shared";
import CircleLoader from "./CircleLoader.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

interface NestedObject {
  [key: string]: string | number | boolean | NestedObject;
}

export default defineComponent({
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    Th,
    Td,
    Tbody,
    Thead,
    Tr,
    Table,
    CircleLoader,
  },
  props: {
    head: {
      type: Array as PropType<{ key: string; name: string }[]>,
      required: true,
    },
    data: {
      type: Array as PropType<JsonModel[] | null>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      perPage: 12,
      page: 1,
    };
  },
  computed: {
    start() {
      if (this.data === null || this.data.length === 0) return 0;
      return (this.page - 1) * this.perPage + 1;
    },
    end() {
      if (this.data === null) return 0;
      return Math.min(this.page * this.perPage, this.data.length);
    },
    pages() {
      if (this.data === null) return [1];
      return Array.from(
        Array(Math.ceil(this.data.length / this.perPage)).keys(),
      ).map((i) => (i += 1));
    },
    total() {
      if (this.data === null) return 0;
      return this.data.length;
    },
    innerLoading() {
      return this.loading || this.data === null;
    },
  },
  watch: {
    data: function () {
      if (!this.pages.includes(this.page)) this.page = 1;
    },
  },
  methods: {
    getData(
      data: NestedObject,
      key: string | string[],
    ): string | number | boolean {
      if (Array.isArray(key)) {
        let newData = data as NestedObject | string | number | boolean;
        key.forEach((key) => {
          if (newData) newData = (newData as NestedObject)[key];
          else return "";
        });
        return newData as unknown as string | number | boolean;
      }
      return data[key] as number | string | boolean;
    },
  },
});
</script>
