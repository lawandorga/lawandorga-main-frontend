<script setup lang="ts">
import { ModalUpdate, types } from "lorga-ui";
import { ref, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  originalStart: string;
  startTime: string;
  endTime: string | null;
  occurrenceTitle: string;
  location: string;
  description: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields: types.FormField[] = [
  { label: "Title", name: "title", type: "text", required: true },
  {
    label: "Start",
    name: "start_time",
    type: "datetime-local",
    required: true,
  },
  { label: "End", name: "end_time", type: "datetime-local", required: true },
  { label: "Location", name: "location", type: "text", required: false },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    required: false,
  },
];

const request = (data: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = { ...data };
  if (normalized.end_time === "") normalized.end_time = null;
  return commandRequest(normalized);
};

const buildInitialData = (): Record<string, unknown> => ({
  action: "calendar/update_event_occurrence",
  event_uuid: props.eventUuid,
  original_start: props.originalStart,
  title: props.occurrenceTitle,
  start_time: toLocalDateTimeInput(props.startTime),
  end_time: props.endTime ? toLocalDateTimeInput(props.endTime) : "",
  location: props.location,
  description: props.description,
});

// lorga-ui re-clones :data into the form only when the object reference changes,
// so open() assigns a fresh object here to reset the form on each opening
const initialData = ref<Record<string, unknown>>(buildInitialData());

defineExpose({
  open: () => {
    initialData.value = buildInitialData();
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalUpdate
    v-model="commandModalOpen"
    title="Edit This Event"
    :fields="fields"
    :request="request"
    :data="initialData"
    submit="Update"
  />
</template>
