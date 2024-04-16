<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { TableGenerator } from "lorga-ui";
import ButtonLink from "@/components/ButtonLink.vue";
import { ListRecordV2 } from "../types/listRecordV2";

// get display values
const dtRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const getDisplayValueFromRecord = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  r: Record<string, any>,
  key: string,
): string => {
  const entry = r.attributes[key];
  if (entry !== undefined) {
    if (Array.isArray(entry)) return entry.join(", ");
    if (dtRegex.test(entry)) {
      const date = new Date(entry);
      return date.toLocaleString("de-DE").replace(",", "");
    }
    return entry;
  }
  return "";
};

// props
const props = defineProps<{
  records?: ListRecordV2[];
  columns: string[] | null;
}>();

// records
const { records, columns } = toRefs(props);

// head
const head = computed<{ name: string; key: string; sortable: boolean }[]>(
  () => {
    if (records.value === null || columns.value === null) return [];
    const head1 = columns.value;
    const head2 = head1.map((n) => ({ name: n, key: n, sortable: true }));
    head2.push({ name: "", key: "action", sortable: false });
    head2.unshift({ name: "Token", key: "token", sortable: true });
    return head2;
  },
);
</script>

<template>
  <TableGenerator :head="head" :data="records">
    <template #head-action>
      <slot name="head-action"></slot>
    </template>
    <template
      v-for="(headItem, index) in head"
      #[headItem.key]="{ i }"
      :key="headItem.key"
    >
      <div>
        <template v-if="index === 0">
          <ButtonLink
            v-if="i.has_access"
            :to="{
              name: 'folders-detail',
              params: { uuid: i.folder_uuid },
              query: {
                selectedType: 'RECORD',
                selectedId: i.data_sheet_uuid,
              },
            }"
          >
            {{ i.token }}
          </ButtonLink>
          <div v-else>
            {{ i.token }}
          </div>
        </template>

        <template v-else-if="i.attributes[headItem.key]">
          <ul
            v-if="Array.isArray(i.attributes[headItem.key])"
            class="list-disc pl-3.5"
          >
            <li v-for="a in i.attributes[headItem.key]" :key="a">
              {{ a }}
            </li>
          </ul>

          <div v-else class="max-w-xs text-left whitespace-normal line-clamp-3">
            {{ getDisplayValueFromRecord(i, headItem.key) }}
          </div>
        </template>

        <template v-else-if="headItem.key === 'action'">
          <slot :record="i" name="action"></slot>
        </template>

        <template v-else>-</template>
      </div>
    </template>
  </TableGenerator>
</template>
