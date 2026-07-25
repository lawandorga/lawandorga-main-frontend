<script setup lang="ts">
import { ModalUpdate, types } from "lorga-ui";
import { computed, ref, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

import type { CalendarEvent } from "../api/useCalendarEvents";
import CalendarReminders from "../components/CalendarReminders.vue";
import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";
import useShareTargetOptions from "../composables/useShareTargetOptions";

const props = defineProps<{
  query: () => void;
  event: CalendarEvent;
}>();
const { query, event } = toRefs(props);

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
    label: "View Access",
    name: "view_grant_targets",
    type: "multiple",
    required: false,
    options: shareTargetOptions.value,
    helptext: "Search and select users, groups, or the whole org.",
  },
  {
    label: "Edit Access",
    name: "edit_grant_targets",
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
  {
    name: "reminder",
    type: "slot",
  },
]);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const request = (data: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = { ...data };
  if (normalized.end_time === "") normalized.end_time = null;
  if (normalized.recurrence_until === "") normalized.recurrence_until = null;
  return commandRequest(normalized);
};

const buildInitialData = (): Record<string, unknown> => ({
  event_uuid: props.event.uuid,
  title: props.event.title,
  event_type: props.event.event_type,
  start_time: toLocalDateTimeInput(props.event.start_time),
  end_time: props.event.end_time
    ? toLocalDateTimeInput(props.event.end_time)
    : "",
  is_all_day: props.event.is_all_day,
  recurrence_rule: props.event.recurrence_rule,
  recurrence_until: props.event.recurrence_until ?? "",
  view_grant_targets: props.event.view_grant_targets,
  edit_grant_targets: props.event.edit_grant_targets,
  location: props.event.location,
  description: props.event.description,
  action: "calendar/update_event",
});

// lorga-ui re-clones :data into the form only when the object reference changes,
// so open() assigns a fresh object here to reset the form on each opening
const initialData = ref<Record<string, unknown>>(buildInitialData());

defineExpose({
  open: () => {
    loadShareTargetOptions();
    initialData.value = buildInitialData();
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Edit Event"
    :request="request"
    :data="initialData"
    submit="Update"
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
    <template #reminder>
      <CalendarReminders :event="event" :query="query" />
    </template>
  </ModalUpdate>
</template>
