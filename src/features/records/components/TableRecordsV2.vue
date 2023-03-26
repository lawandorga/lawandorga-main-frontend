<template>
  <div
    class="flex flex-col items-start mb-5 space-y-3 xl:items-stretch xl:flex-row xl:space-y-0"
  >
    <div
      class="flex items-center px-6 py-1 space-x-5 bg-white border border-gray-300 rounded-md shadow-sm xl:py-0"
    >
      <div class="leading-none">
        <ButtonNormal
          kind="action"
          @click="search = userStore.user?.name || ''"
        >
          Show My Records
        </ButtonNormal>
      </div>
      <div class="leading-none">
        <ButtonNormal kind="action" @click="search = '22'">
          Show Contains '2022'
        </ButtonNormal>
      </div>
    </div>
    <div class="right-0 w-full max-w-md md:ml-auto md:sticky">
      <FormInput
        v-model="search"
        name="search"
        label=""
        placeholder="AZ-123 / Open / Consultant / Tag"
        type="search"
        required
      />
    </div>
  </div>
  <TableSortable
    :head="head"
    :data="filteredRecords"
    :get-value-func="getValueFromRecord"
    :sort-key="(userStore.getSetting('recordsSortKey') as string)"
    :sort-order="(userStore.getSetting('recordsSortOrder') as string)"
    @update:sort-key="userStore.updateSetting('recordsSortKey', $event)"
    @update:sort-order="userStore.updateSetting('recordsSortOrder', $event)"
  >
    <template #head-action>
      <slot name="head-action"></slot>
    </template>
    <template
      v-for="(headItem, index) in head"
      #[headItem.key]="{ item }"
      :key="headItem.key"
    >
      <div>
        <template v-if="index === 0">
          <ButtonLink
            v-if="item.has_access"
            :to="{
              name: 'folders-detail',
              params: { uuid: item.folder_uuid },
              query: {
                selectedType: 'RECORD',
                selectedId: item.data_sheet_uuid,
              },
            }"
          >
            {{ item.token }}
          </ButtonLink>
          <div v-else>
            {{ item.token }}
          </div>
        </template>

        <template v-else-if="item.attributes[headItem.key]">
          <ul
            v-if="Array.isArray(item.attributes[headItem.key])"
            class="list-disc pl-3.5"
          >
            <li v-for="i in item.attributes[headItem.key]" :key="i">
              <button
                class="text-left cursor-pointer hover:underline"
                @click="search = i"
              >
                {{ i }}
              </button>
            </li>
          </ul>

          <button
            v-else
            class="max-w-xs text-left whitespace-normal cursor-pointer line-clamp-3 hover:underline"
            @click="search = getValueFromRecord(item, headItem.key)"
          >
            {{ getValueFromRecord(item, headItem.key) }}
          </button>
        </template>

        <template v-else-if="headItem.key === 'action'">
          <slot :record="item" name="action"></slot>
        </template>

        <template v-else>-</template>
      </div>
    </template>
  </TableSortable>
</template>

<script lang="ts" setup>
import { PropType, toRefs, computed } from "vue";
import {
  FormInput,
  TableSortable,
  ButtonNormal,
  types,
} from "@lawandorga/components";
import ButtonLink from "@/components/ButtonLink.vue";
import useSearch from "@/composables/useSearch";
import { useUserStore } from "@/store/user";
import { IListRecordV2 } from "../types/listRecordV2";

// get values
const getValueFromEntry = (entry: string[] | string): string => {
  if (Array.isArray(entry)) return entry.join(", ");
  return entry;
};

const getValueFromRecord = (
  r: types.JsonModel,
  key: string,
  defaultValue = "",
): string => {
  const entry = r.attributes[key];

  if (entry !== undefined) return getValueFromEntry(entry);
  return defaultValue;
};

// props
const props = defineProps({
  records: {
    type: Array as PropType<IListRecordV2[] | null>,
    required: false,
    default: null,
  },
  columns: {
    type: Array as PropType<string[] | null>,
    required: false,
    default: null,
  },
});

// records
const { records, columns } = toRefs(props);

// head
const head = computed<{ name: string; key: string; sortable: boolean }[]>(
  () => {
    if (records.value === null || columns.value === null) return [];
    const head1 = columns.value;
    const head2 = head1.map((n) => ({ name: n, key: n, sortable: true }));
    head2.push({ name: "", key: "action", sortable: false });
    return head2;
  },
);

// filter
const filterKeys = computed(() => head.value.map((h) => h.name));
const { filteredItems: filteredRecords, search } = useSearch(
  records,
  filterKeys,
  getValueFromRecord,
);

// set default sort
const userStore = useUserStore();
</script>
