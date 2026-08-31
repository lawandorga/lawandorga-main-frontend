<script setup lang="ts">
import { computed, ref, toRefs } from "vue";

import useCmd from "@/composables/useCmd";

import type { CalendarEvent } from "../api/useCalendarEvents";
import { type ReminderSettings } from "../constants";
import { isRecurring } from "../utils/occurrences";
import { findFreeReminderSlot } from "../utils/reminders";
import ReminderListEditor, { type ReminderRow } from "./ReminderListEditor.vue";

const props = defineProps<{
  event: CalendarEvent;
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest } = useCmd(query);

const ignoreHandledError = () => undefined; // the command error handler already alerts

const reminderRows = computed<ReminderRow[]>(() =>
  [...props.event.own_reminders]
    .sort((a, b) => a.minutes_before - b.minutes_before)
    .map((reminder) => ({
      key: reminder.uuid,
      minutes_before: reminder.minutes_before,
      method: reminder.method,
    })),
);

const MINUTE_IN_MS = 60 * 1000;

const minutesUntilStart = computed(
  () =>
    (new Date(props.event.start_time).getTime() - Date.now()) / MINUTE_IN_MS,
);

const nextFreeReminderSlot = computed<ReminderSettings | null>(() =>
  findFreeReminderSlot(
    props.event.own_reminders,
    // a series keeps producing occurrences, so its own start time is no cutoff
    isRecurring(props.event) ? null : minutesUntilStart.value,
  ),
);

const reminderNotice = computed(() =>
  nextFreeReminderSlot.value
    ? ""
    : "No reminder times are available for this event.",
);

const addReminder = () => {
  const slot = nextFreeReminderSlot.value;
  if (!slot) return;
  commandRequest({
    action: "calendar/create_reminder",
    event_uuid: props.event.uuid,
    minutes_before: slot.minutes_before,
    method: slot.method,
  }).catch(ignoreHandledError);
};

const editorRemountKey = ref(0);

const updateReminder = (
  key: string | number,
  patch: Partial<ReminderSettings>,
) => {
  commandRequest({
    action: "calendar/update_reminder",
    reminder_uuid: key,
    ...patch,
  }).catch(() => {
    // a rejected update leaves the dropdown on the value the user picked
    editorRemountKey.value += 1;
  });
};

const removeReminder = (key: string | number) => {
  commandRequest({
    action: "calendar/delete_reminder",
    reminder_uuid: key,
  }).catch(ignoreHandledError);
};
</script>

<template>
  <div class="space-y-3">
    <ReminderListEditor
      :key="editorRemountKey"
      :reminders="reminderRows"
      :addingDisabled="!!reminderNotice"
      @add="addReminder"
      @update="updateReminder"
      @remove="removeReminder"
    />
    <p v-if="reminderNotice" class="text-sm text-gray-500">
      {{ reminderNotice }}
    </p>
  </div>
</template>
