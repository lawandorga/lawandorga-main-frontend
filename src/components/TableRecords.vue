<template>
  <Table>
    <Thead>
      <Tr class="border-b border-gray-200 bg-white">
        <Td :colspan="head.length + 3" class="!py-1.5">
          <FormInput
            v-model="search"
            label=""
            placeholder="AZ-123 / Open / Consultant / Tag"
            type="search"
            required
            class="max-w-md ml-auto"
          />
        </Td>
      </Tr>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item" class="!pr-2 group">
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="relative min-w-5 h-5 flex-grow"
              @click="changeSort(item)"
            >
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap pr-8"
              >
                {{ item }}
              </div>
              <ChevronUpIcon
                :class="[
                  sortOrder === 'ASC' && sortBy === item
                    ? 'text-gray-400'
                    : 'text-gray-300',
                ]"
                class="w-5 h-5 top-0 right-0 bottom-0 absolute transform -translate-y-1.5"
              />
              <ChevronDownIcon
                :class="[
                  sortOrder === 'DESC' && sortBy === item
                    ? 'text-gray-400'
                    : 'text-gray-300',
                ]"
                class="w-5 h-5 top-0 right-0 bottom-0 absolute transform translate-y-1.5"
              />
            </button>
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
          v-for="record in paginatedRecords"
          :key="record.id"
          class="divide-x divide-gray-100"
        >
          <Td v-for="(headItem, index) in head" :key="headItem">
            <template v-if="headItem === 'Created' || headItem === 'Updated'">
              <span v-if="headItem === 'Created'">
                {{ formatDate(record.created) }}
              </span>
              <span v-else-if="headItem === 'Updated'">
                {{ formatDate(record.updated) }}
              </span>
            </template>
            <template v-else-if="index === 0">
              <ButtonLink
                v-if="record.access"
                :to="{
                  name: 'records-detail',
                  params: { id: record.id },
                }"
              >
                {{ record.entries[headItem]?.value ?? "undefined" }}
              </ButtonLink>
              <div v-else>
                {{ record.entries[headItem]?.value ?? "undefined" }}
              </div>
            </template>
            <template v-else-if="record.entries[headItem]">
              <button
                v-if="record.entries[headItem].type === 'text'"
                class="max-w-xs whitespace-normal line-clamp-3 cursor-pointer hover:underline text-left"
                @click="search = record.entries[headItem].value"
              >
                {{ record.entries[headItem].value }}
              </button>
              <button
                v-else-if="
                  record.entries[headItem].type === 'date' ||
                  record.entries[headItem].type === 'datetime-local'
                "
                class="cursor-pointer hover:underline text-left"
                @click="search = record.entries[headItem].value"
              >
                {{ formatDate(record.entries[headItem].value) }}
              </button>
              <ul
                v-else-if="record.entries[headItem].type === 'multiple'"
                class="list-disc pl-3.5"
              >
                <li v-for="item in record.entries[headItem].value" :key="item">
                  <button
                    class="cursor-pointer hover:underline text-left"
                    @click="search = item.name ?? item"
                  >
                    {{ item.name ?? item }}
                  </button>
                </li>
              </ul>
              <button
                v-else
                class="cursor-pointer hover:underline text-left"
                @click="search = record.entries[headItem].value"
              >
                {{ record.entries[headItem].value }}
              </button>
            </template>
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
import { Record } from "@/types/records";
import usePagination from "@/composables/usePagination";
import TablePagination from "@/components/TablePagination.vue";
import { formatDate } from "@/utils/date";
import ButtonLink from "@/components/ButtonLink.vue";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/solid";
import useSort from "@/composables/useSort";
import FormInput from "@/components/FormInput.vue";
import useSearch from "@/composables/useSearch";

export default defineComponent({
  components: {
    FormInput,
    ChevronUpIcon,
    ChevronDownIcon,
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
      type: Array as PropType<Record[] | null>,
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
    // records & loading
    const { records, loading } = toRefs(props);

    const innerLoading = computed(() => {
      return loading.value || records.value === null;
    });

    // filter
    const { filterRecord, search } = useSearch();

    const filteredRecords = computed(() => {
      if (search.value === "" || !Array.isArray(records.value))
        return records.value;
      return records.value.filter(filterRecord(search.value));
    });

    // sort
    const { sortBy, sortOrder, changeSort, schwartzSortRecords } = useSort();

    const sortedRecords = computed(() => {
      if (filteredRecords.value === null) return null;
      const sortedRecords = schwartzSortRecords([...filteredRecords.value]);
      return sortedRecords;
    });

    // paginate
    const {
      pages,
      start,
      end,
      paginatedData: paginatedRecords,
      total,
      currentPage,
      previousPage,
      nextPage,
      setPage,
    } = usePagination(sortedRecords, 12);

    // head
    const head = computed(() => {
      if (paginatedRecords.value === null) return [];
      const head = Array.from(
        new Set(paginatedRecords.value.map((r: Record) => r.show).flat()),
      );
      head.push("Created");
      head.push("Updated");
      return head;
    });

    // return
    return {
      search,
      sortBy,
      sortOrder,
      changeSort,
      formatDate,
      pages,
      start,
      end,
      paginatedRecords,
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
