<script setup lang="ts">
import { ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";

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
    name: "event_type",
    type: "slot",
  },
  {
    name: "when",
    type: "slot",
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
    :data="{
      action: 'calendar/create_event',
      event_type: 'APPOINTMENT',
      is_all_day: false,
      start_time: new Date().toISOString().slice(0, 14) + '00',
      end_time:
        new Date(Date.now() + 3600000).toISOString().slice(0, 14) + '00',
      recurrence_rule: '',
      recurrence_until: '',
    }"
    submit="Create"
  >
    <template #event_type="{ data }">
      <CalendarTypePicker v-model="data.event_type" />
    </template>
    <template #when="{ data }">
      <CalendarWhenFields
        v-model:is-all-day="data.is_all_day"
        v-model:start="data.start_time"
        v-model:end="data.end_time"
        v-model:recurrence-rule="data.recurrence_rule"
        v-model:recurrence-until="data.recurrence_until"
        :event-type="data.event_type"
      />
    </template>
  </ModalCreate>
</template>
