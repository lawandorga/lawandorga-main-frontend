<script lang="ts" setup>
import DataSheetChangeName from "../actions/DataSheetChangeName.vue";
import { formatDate } from "@/utils/date";
import { computed, ref, toRefs, watch } from "vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FormDataSheet from "./FormDataSheet.vue";
import { ButtonNormal, CircleLoader, ModalFree } from "lorga-ui";
import DeleteDataSheet from "../actions/DeleteDataSheet.vue";
import { useDataSheet } from "../api/useDataSheet";
import { Content } from "@/features/folders/api/useFolder";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";

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

const emptyRequiredFields = computed(() => {
  const currentRecord = record.value;
  if (!currentRecord) return [];

  return currentRecord.fields.filter((field) => {
    if (!field.is_required) return false;
    const value = currentRecord.entries[field.uuid];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  });
});

const showNavigationWarning = ref(false);
// eslint-disable-next-line no-unused-vars
let resolveNavigationGuard: ((confirmed: boolean) => void) | null = null;

const askToConfirmLeaving = (): Promise<boolean> =>
  new Promise((resolve) => {
    showNavigationWarning.value = true;
    resolveNavigationGuard = resolve;
  });

const confirmLeaving = (confirmed: boolean) => {
  resolveNavigationGuard?.(confirmed);
  resolveNavigationGuard = null;
  showNavigationWarning.value = false;
};

// Also handle modal closed via X or backdrop click
watch(showNavigationWarning, (value) => {
  if (!value) confirmLeaving(false);
});

onBeforeRouteUpdate(async (to, from) => {
  const fromRecordId = from.query.selectedId;
  const toRecordId = to.query.selectedId;
  if (
    fromRecordId &&
    fromRecordId !== toRecordId &&
    emptyRequiredFields.value.length > 0
  ) {
    return (await askToConfirmLeaving()) ? undefined : false;
  }
});

onBeforeRouteLeave(async () => {
  if (record.value && emptyRequiredFields.value.length > 0) {
    return (await askToConfirmLeaving()) ? undefined : false;
  }
});
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

  <ModalFree v-model="showNavigationWarning" title="Required fields missing">
    <p class="mb-3 text-sm text-gray-700">
      The following fields are still empty:
    </p>
    <ul class="pl-5 mb-5 text-sm text-gray-900 list-disc">
      <li v-for="field in emptyRequiredFields" :key="field.uuid">
        {{ field.name }}
      </li>
    </ul>
    <div class="flex items-center justify-end gap-3">
      <ButtonNormal kind="primary" @click="confirmLeaving(false)">
        Back to record
      </ButtonNormal>
      <ButtonNormal kind="delete" @click="confirmLeaving(true)">
        Leave anyway
      </ButtonNormal>
    </div>
  </ModalFree>
</template>
