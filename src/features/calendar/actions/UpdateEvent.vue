<script setup lang="ts">
import { ModalUpdate, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";
import { toLocalDateTimeInput } from "@/utils/date";

import type { CalendarEvent } from "../api/useCalendarEvents";
import CalendarReminders from "../components/CalendarReminders.vue";
import CalendarTypePicker from "../components/CalendarTypePicker.vue";
import CalendarWhenFields from "../components/CalendarWhenFields.vue";
import useShareTargetOptions from "../composables/useShareTargetOptions";

const props = defineProps<{
  query: () => void;
  event: CalendarEvent;
  openSignal?: number;
}>();
const { query, event, openSignal } = toRefs(props);

const userStore = useUserStore();
const { shareTargetOptions, loadShareTargetOptions } = useShareTargetOptions();

const canEdit = computed(() => userStore.user?.id === event.value.creator_id);

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

watch(openSignal, (next, prev) => {
  if (next !== undefined && next !== prev && canEdit.value) {
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
      event_uuid: event.uuid,
      title: event.title,
      event_type: event.event_type,
      start_time: toLocalDateTimeInput(event.start_time),
      end_time: event.end_time ? toLocalDateTimeInput(event.end_time) : '',
      is_all_day: event.is_all_day,
      recurrence_rule: event.recurrence_rule,
      recurrence_until: event.recurrence_until ?? '',
      grant_targets: event.grant_targets,
      location: event.location,
      description: event.description,
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
    <template #reminder>
      <CalendarReminders :event="event" :query="query" />
    </template>
  </ModalUpdate>
</template>
