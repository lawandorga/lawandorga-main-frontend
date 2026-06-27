<script setup lang="ts">
import { ModalCreate, types } from "lorga-ui";
import { ref, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

const DEFAULT_DURATION_MS = 30 * 60 * 1000;

interface EventTimePrefill {
  start: Date;
  end?: Date;
  allDay?: boolean;
}

const buildInitialData = (prefill?: EventTimePrefill) => {
  const start = prefill?.start ?? new Date();
  const defaultEnd = new Date(start.getTime() + DEFAULT_DURATION_MS);
  const end = prefill?.end ?? (prefill?.allDay ? null : defaultEnd);

  return {
    action: "calendar/create_event",
    event_type: "APPOINTMENT",
    is_all_day: prefill?.allDay ?? false,
    start_time: toLocalDateTimeInput(start.toISOString()),
    end_time: end ? toLocalDateTimeInput(end.toISOString()) : "",
    recurrence_rule: "",
    recurrence_until: "",
  };
};

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

// lorga-ui re-clones :data into the form only when the object reference changes,
// so open() assigns a fresh object here to reset the form on each opening
const initialData = ref<Record<string, unknown>>(buildInitialData());

defineExpose({
  open: (prefill?: EventTimePrefill) => {
    initialData.value = buildInitialData(prefill);
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
    :data="initialData"
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
