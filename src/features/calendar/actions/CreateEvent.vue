<script setup lang="ts">
import { ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

const fields: types.FormField[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Type",
    name: "event_type",
    type: "select",
    required: true,
    options: [
      { name: "Appointment", value: "APPOINTMENT" },
      { name: "Task", value: "TASK" },
      { name: "Meeting", value: "MEETING" },
      { name: "Deadline", value: "DEADLINE" },
      { name: "External", value: "EXTERNAL" },
    ],
  },
  {
    label: "Start time",
    name: "start_time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End time",
    name: "end_time",
    type: "datetime-local",
    required: false,
  },
  {
    label: "Location",
    name: "location",
    type: "text",
    required: false,
  },
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
  if (normalized.recurrence_until === "") normalized.recurrence_until = null;
  return commandRequest(normalized);
};

defineExpose({
  open: () => {
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create Event"
    :fields="fields"
    :request="request"
    :data="{ action: 'calendar/create_event', event_type: 'MEETING' }"
    submit="Create"
  />
</template>