<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item">
          <div class="flex items-center justify-between">
            {{ item }}
          </div>
        </Th>
        <Th>Created</Th>
        <Th>Updated</Th>
        <Th>
          <slot name="head-action"></slot>
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      <template v-if="records !== null">
        <Tr
          v-for="record in paginatedData"
          :key="record.id"
          class="divide-x divide-gray-100"
        >
          <Td v-for="(headItem, index) in head" :key="headItem">
            <template v-if="record.entries[headItem]">
              <template v-if="index === 0">
                <ButtonLink
                  v-if="record.access"
                  :to="{
                    name: 'records-detail',
                    params: { id: record.id },
                  }"
                >
                  {{ record.entries[headItem].value }}
                </ButtonLink>
                <div v-else>
                  {{ record.entries[headItem].value }}
                </div>
              </template>
              <button
                v-else-if="record.entries[headItem].field_type === 'text'"
                class="
                  max-w-xs
                  whitespace-normal
                  line-clamp-3
                  cursor-pointer
                  hover:underline
                  text-left
                "
                @click="$emit('search', record.entries[headItem].value)"
              >
                {{ record.entries[headItem].value }}
              </button>
              <button
                v-else-if="
                  record.entries[headItem].field_type === 'date' ||
                  record.entries[headItem].field_type === 'datetime-local'
                "
                class="cursor-pointer hover:underline text-left"
                @click="$emit('search', record.entries[headItem].value)"
              >
                {{ formatDate(record.entries[headItem].value) }}
              </button>
              <ul
                v-else-if="record.entries[headItem].field_type === 'multiple'"
                class="list-disc pl-3.5"
              >
                <li v-for="item in record.entries[headItem].value" :key="item">
                  <button
                    class="cursor-pointer hover:underline text-left"
                    @click="$emit('search', item)"
                  >
                    {{ item }}
                  </button>
                </li>
              </ul>
              <button
                v-else
                class="cursor-pointer hover:underline text-left"
                @click="$emit('search', record.entries[headItem].value)"
              >
                {{ record.entries[headItem].value }}
              </button>
            </template>
          </Td>
          <Td>
            {{ formatDate(record.created) }}
          </Td>
          <Td>
            {{ formatDate(record.updated) }}
          </Td>
          <Td>
            <slot :record="record" name="action"></slot>
          </Td>
        </Tr>
      </template>
      <Tr v-show="innerLoading">
        <Td :colspan="head.length + 3">
          <CircleLoader />
        </Td>
      </Tr>
      <TablePagination
        :colspan="head.length + 3"
        :previous-page="previousPage"
        :set-page="setPage"
        :next-page="nextPage"
        :total="total"
        :current="currentPage"
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
import { formatDate } from "@/utils/date";
import ButtonLink from "@/components/ButtonLink.vue";

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
    ButtonLink,
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
  emits: ["search"],
  setup(props) {
    const { records, loading } = toRefs(props);
    const innerLoading = computed(() => {
      return loading.value || records.value === null;
    });
    const {
      pages,
      start,
      end,
      paginatedData,
      total,
      currentPage,
      previousPage,
      nextPage,
      setPage,
    } = usePagination(records, 12);

    const head = computed(() => {
      if (paginatedData.value === null) return [];
      return Array.from(
        new Set(
          paginatedData.value.map((r: RestrictedRecord) => r.show).flat(),
        ),
      );
    });

    return {
      formatDate,
      pages,
      start,
      end,
      paginatedData,
      total,
      currentPage,
      previousPage,
      nextPage,
      setPage,
      innerLoading,
      head,
    };
  },
});
</script>
