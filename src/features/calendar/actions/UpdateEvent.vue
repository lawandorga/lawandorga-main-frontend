<script setup lang="ts">
import { ModalUpdate, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { toLocalDateTimeInput } from "@/utils/date";

import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";
import useShareTargetOptions from "../composables/useShareTargetOptions";
import type { EventType } from "../constants";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  eventTitle: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  isAllDay: boolean;
  location: string;
  description: string;
  recurrenceRule: string;
  recurrenceUntil: string | null;
  viewGrantTargets: string[];
  editGrantTargets: string[];
  openSignal?: number;
}>();
const {
  query,
  eventUuid,
  eventTitle,
  eventType,
  startTime,
  endTime,
  location,
  description,
  viewGrantTargets,
  editGrantTargets,
  openSignal,
} = toRefs(props);
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
]);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const request = (data: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = { ...data };
  if (normalized.end_time === "") normalized.end_time = null;
  if (normalized.recurrence_until === "") normalized.recurrence_until = null;
  return commandRequest(normalized);
};

watch(openSignal, (next, prev) => {
  if (next !== undefined && next !== prev) {
    loadShareTargetOptions();
    commandModalOpen.value = true;
  }
});
</script>

<template>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Edit Event"
    :request="request"
    :data="{
      event_uuid: eventUuid,
      title: eventTitle,
      event_type: eventType,
      start_time: toLocalDateTimeInput(startTime),
      end_time: endTime ? toLocalDateTimeInput(endTime) : '',
      is_all_day: isAllDay,
      recurrence_rule: recurrenceRule,
      recurrence_until: recurrenceUntil ?? '',
      view_grant_targets: viewGrantTargets,
      edit_grant_targets: editGrantTargets,
      location,
      description,
      action: 'calendar/update_event',
    }"
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
  </ModalUpdate>
</template>
