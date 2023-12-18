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
      <FormRecord :record="record" :query="recordsQuery"></FormRecord>
      <template #buttons>
        <DataSheetChangeName
          :id="record.id"
          :query="allQuery"
          :name="record.name"
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

<script lang="ts" setup>
import DataSheetChangeName from "../actions/DataSheetChangeName.vue";
import { formatDate } from "@/utils/date";
import { ref, toRefs, watch } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FormRecord from "./FormRecord.vue";
import { Record } from "@/types/records";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "lorga-ui";
import useClient from "@/api/client";
import DeleteDataSheet from "../actions/DeleteDataSheet.vue";

// props
const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
  onDelete?: () => void;
}>();
const { selectedId, selectedType, query } = toRefs(props);

// record
const client = useClient();
const request = client.get("api/data_sheets/query/{}/", selectedId);
const record = ref<Record | null>(null);
const recordsQuery = useQuery(request, record);

const update = () => {
  if (record.value && selectedId.value !== record.value.uuid)
    record.value = null;
  if (selectedType.value === "RECORD" && selectedId.value) {
    recordsQuery();
  }
};
watch(selectedId, () => {
  update();
});
update();

// query
const allQuery = () => {
  query.value();
  recordsQuery();
};
</script>
