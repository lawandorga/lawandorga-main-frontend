<script lang="ts" setup>
import DataSheetChangeName from "../actions/DataSheetChangeName.vue";
import { formatDate } from "@/utils/date";
import { toRefs, watch } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FormDataSheet from "./FormDataSheet.vue";
import { CircleLoader } from "lorga-ui";
import DeleteDataSheet from "../actions/DeleteDataSheet.vue";
import { useDataSheet } from "../api/useDataSheet";
import { Content } from "@/features/folders/api/useFolder";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  folderContent: Content[];
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
  onDelete?: () => void;
}>();
const { selectedId, selectedType, query } = toRefs(props);

const router = useRouter();
const route = useRoute();

watch(
  [selectedId, selectedType],
  () => {
    if (selectedType.value === "RECORD" && !selectedId.value) {
      const found = props.folderContent.find((c) => c.repository === "RECORD");
      if (found) {
        router.push({
          name: "folders-detail",
          params: { uuid: route.params.uuid },
          query: {
            ...router.currentRoute.value.query,
            selectedId: found.uuid,
            selectedType: "RECORD",
          },
        });
      }
    }
  },
  { immediate: true },
);

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
