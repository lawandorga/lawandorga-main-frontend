<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item">
          <div class="flex items-center justify-between">
            {{ item }}
          </div>
        </Th>
        <Th>
          <slot name="head-action"></slot>
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      <template v-if="records !== null">
        <Tr
          v-for="(dataItem, index) in paginatedData"
          :key="index"
          class="divide-x divide-gray-100"
        >
          <Td v-for="headItem in head" :key="headItem">
            {{ dataItem["entries"][headItem]["value"] }}
            <!-- TODO: display according to entry type -->
            <!-- TODO: django change return of record list -->
          </Td>
          <Td>
            <slot
              :dataItem="dataItem"
              :headItem="headItem"
              name="action"
            ></slot>
          </Td>
        </Tr>
      </template>
      <Tr v-show="innerLoading">
        <Td :colspan="head.length + 1">
          <CircleLoader />
        </Td>
      </Tr>
      <TablePagination
        :colspan="head.length + 1"
        :previous-page="previousPage"
        :set-page="setPage"
        :next-page="nextPage"
        :total="total"
        :current="current"
        :start="start"
        :end="end"
        :pages="pages"
        name="records"
      />
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
import { defineComponent, PropType, toRefs, computed } from "vue";
import CircleLoader from "./CircleLoader.vue";
import { RestrictedRecord } from "@/types/records";
import usePagination from "@/composables/usePagination";
import TablePagination from "@/components/TablePagination.vue";
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
    TablePagination,
  },
  props: {
    records: {
      type: Array as PropType<RestrictedRecord[] | null>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { records, loading } = toRefs(props);
    const innerLoading = computed(() => {
      return loading.value || records.value === null;
    });
    const { pages, start, end, paginatedData, total, previous, next, setPage } =
      usePagination(records, 12);

    const head = computed(() => {
      if (paginatedData.value === null) return [];
      return Array.from(
        new Set(
          paginatedData.value
            .map((r: RestrictedRecord) => r.entries.map((e) => e.name))
            .flat(),
        ),
      );
    });

    return {
      pages,
      start,
      end,
      paginatedData,
      total,
      previous,
      next,
      setPage,
      innerLoading,
      head,
    };
  },
  computed: {
    mappedRecords() {
      return this.records
        ? this.records.map((r) => ({
            ...r,
            data: Object.assign(
              {},
              ...r.entries.map((e) => ({ [e.name]: e.value })),
            ),
          }))
        : [];
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
