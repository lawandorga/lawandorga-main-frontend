<script setup lang="ts">
import { computed, ref } from "vue";

import useCmd from "@/composables/useCmd";

import type { CalendarEvent } from "../api/useCalendarEvents";
import { REMINDER_CANDIDATES, type ReminderSettings } from "../constants";
import ReminderListEditor, { type ReminderRow } from "./ReminderListEditor.vue";

const props = defineProps<{
  event: CalendarEvent;
  query: () => void;
}>();

const { commandRequest } = useCmd(() => props.query());

const isRecurring = computed(() => props.event.recurrence_rule !== "");

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

const slotKey = (slot: ReminderSettings): string =>
  `${slot.method}:${slot.minutes_before}`;

const nextFreeReminderSlot = computed<ReminderSettings | null>(() => {
  const taken = new Set(props.event.own_reminders.map(slotKey));
  const minutesUntilStart =
    (new Date(props.event.start_time).getTime() - Date.now()) / MINUTE_IN_MS;
  return (
    REMINDER_CANDIDATES.find(
      (candidate) =>
        !taken.has(slotKey(candidate)) &&
        candidate.minutes_before < minutesUntilStart,
    ) ?? null
  );
});

const reminderNotice = computed(() => {
  if (isRecurring.value)
    return "Reminders for repeating events are coming soon.";
  if (!nextFreeReminderSlot.value)
    return "No reminder times are available for this event.";
  return "";
});

const addReminder = () => {
  const slot = nextFreeReminderSlot.value;
  if (!slot) return;
  commandRequest({
    action: "calendar/create_reminder",
    event_uuid: props.event.uuid,
    minutes_before: slot.minutes_before,
    method: slot.method,
  }).catch(() => undefined); // the command error handler already alerts
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
  }).catch(() => undefined); // the command error handler already alerts
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
