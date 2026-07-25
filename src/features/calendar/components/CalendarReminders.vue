<script setup lang="ts">
import { computed, toRefs } from "vue";

import useCmd from "@/composables/useCmd";

import type { CalendarEvent } from "../api/useCalendarEvents";
import { type ReminderSettings } from "../constants";
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

const addReminder = () => {
  const slot = findFreeReminderSlot(props.event.own_reminders);
  if (!slot) return;
  commandRequest({
    action: "calendar/create_reminder",
    event_uuid: props.event.uuid,
    minutes_before: slot.minutes_before,
    method: slot.method,
  }).catch(ignoreHandledError);
};

const updateReminder = (
  key: string | number,
  patch: Partial<ReminderSettings>,
) => {
  commandRequest({
    action: "calendar/update_reminder",
    reminder_uuid: key,
    ...patch,
  }).catch(ignoreHandledError);
};

const removeReminder = (key: string | number) => {
  commandRequest({
    action: "calendar/delete_reminder",
    reminder_uuid: key,
  }).catch(ignoreHandledError);
};
</script>

<template>
  <ReminderListEditor
    :reminders="reminderRows"
    @add="addReminder"
    @update="updateReminder"
    @remove="removeReminder"
  />
</template>
