<script lang="ts" setup>
import DataSheetChangeName from "../actions/DataSheetChangeName.vue";
import { formatDate } from "@/utils/date";
import { toRefs } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FormDataSheet from "./FormDataSheet.vue";
import { CircleLoader } from "lorga-ui";
import DeleteDataSheet from "../actions/DeleteDataSheet.vue";
import { useDataSheet } from "../api/useDataSheet";

const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
  onDelete?: () => void;
}>();
const { selectedId, selectedType, query } = toRefs(props);

const { record, recordsQuery } = useDataSheet(selectedId, selectedType);

const allQuery = () => {
  query.value();
  recordsQuery();
};
</script>

<template>
  <template v-if="record">
    <BoxHeadingStats
      :show="selectedType === 'RECORD'"
      :title="record.name"
      :stats="[
        `Created: ${formatDate(record.created)}`,
        `Template: ${record.template_name}`,
      ]"
    >
      <FormDataSheet :record="record" :query="recordsQuery"></FormDataSheet>
      <template #buttons>
        <DataSheetChangeName
          :id="record.id"
          :query="allQuery"
          :name="record.name"
          class="mr-3"
        />
        <DeleteDataSheet
          :sheet-uuid="record.uuid"
          :query="query"
          :sheet-name="record.name"
          :on-delete="onDelete"
        />
      </template>
    </BoxHeadingStats>
  </template>
  <CircleLoader v-else-if="selectedType === 'RECORD' && selectedId !== null" />
</template>
