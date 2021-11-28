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
      <Tr
        v-for="(dataItem, index) in data.slice(start, end)"
        :key="index"
        class="divide-x divide-gray-100"
      >
        <Td v-for="headItem in head" :key="headItem.key">
          <slot :dataItem="dataItem" :headItem="headItem" :name="headItem.key">
            {{ getData(dataItem, headItem.key) }}
          </slot>
        </Td>
      </Tr>
      <Tr v-show="loading">
        <Td :colspan="head.length">
          <CircleLoader />
        </Td>
      </Tr>
    </Tbody>
  </Table>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item">
        <button
          v-if="page != 1"
          type="button"
          class="page-link"
          @click="page--"
        >
          Previous
        </button>
      </li>
      <li class="page-item">
        <button
          v-for="pageNumber in pages.slice(Math.max(page - 5, 0), page + 5)"
          :key="pageNumber"
          type="button"
          class="page-link"
          @click="page = pageNumber"
        >
          {{ pageNumber }}
        </button>
      </li>
      <li class="page-item">
        <button
          v-if="page < pages.length"
          type="button"
          class="page-link"
          @click="page++"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
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

interface NestedObject {
  [key: string]: string | number | boolean | NestedObject;
}

export default defineComponent({
  components: {
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
      type: Array as PropType<JsonModel[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      perPage: 2,
      page: 1,
      pages: [],
    };
  },
  computed: {
    start() {
      return this.page * this.perPage - this.perPage;
    },
    end() {
      return this.page * this.perPage;
    },
  },
  watch: {
    data() {
      this.setPages();
    },
  },
  mounted() {
    this.setPages();
  },
  methods: {
    setPages() {
      let numberOfPages = Math.ceil(this.data.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++)
        this.pages.push(index as never);
    },
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
