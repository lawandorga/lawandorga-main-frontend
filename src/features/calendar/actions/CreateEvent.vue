<script setup lang="ts">
import { ModalCreate, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";
import useShareTargetOptions from "../composables/useShareTargetOptions";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
const { shareTargetOptions, loadShareTargetOptions } = useShareTargetOptions();

const fields = computed<types.FormField[]>(() => [
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
    label: "Visible To",
    name: "grant_targets",
    type: "multiple",
    required: false,
    options: shareTargetOptions.value,
    helptext: "Search and select users, groups, or the whole org.",
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
]);

watch(commandModalOpen, (isOpen) => {
  if (!isOpen) return;
  loadShareTargetOptions();
});

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

const nextFullHour = new Date();
nextFullHour.setHours(nextFullHour.getHours() + 1, 0, 0, 0);
const plusOneHour = new Date(nextFullHour.getTime() + 3600000);
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
      start_time: toLocalDateTimeInput(nextFullHour.toISOString()),
      end_time: toLocalDateTimeInput(plusOneHour.toISOString()),
      recurrence_rule: '',
      recurrence_until: '',
      grant_targets: [],
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
      />
    </template>
  </ModalCreate>
</template>
