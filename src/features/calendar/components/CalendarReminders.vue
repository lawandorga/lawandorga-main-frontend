<script setup lang="ts">
import { computed, ref } from "vue";

import useCmd from "@/composables/useCmd";

import type { CalendarEvent } from "../api/useCalendarEvents";
import {
  DEFAULT_REMINDER,
  REMINDER_METHOD_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  type ReminderSettings,
} from "../constants";
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

const findFreeReminderSlot = (): ReminderSettings | null => {
  const taken = new Set(
    props.event.own_reminders.map(
      (reminder) => `${reminder.method}:${reminder.minutes_before}`,
    ),
  );
  const candidates: ReminderSettings[] = [
    DEFAULT_REMINDER,
    ...REMINDER_OFFSET_OPTIONS.flatMap((offset) =>
      REMINDER_METHOD_OPTIONS.map((method) => ({
        minutes_before: offset.minutes,
        method: method.value,
      })),
    ),
  ];
  return (
    candidates.find(
      (candidate) =>
        !taken.has(`${candidate.method}:${candidate.minutes_before}`),
    ) ?? null
  );
};

const addReminder = () => {
  const slot = findFreeReminderSlot();
  if (!slot) return;
  commandRequest({
    action: "calendar/create_reminder",
    event_uuid: props.event.uuid,
    minutes_before: slot.minutes_before,
    method: slot.method,
  }).catch(() => undefined); // the command error handler already alerts
};

const shouldRemountEditor = ref(false);

const updateReminder = (
  key: string | number,
  patch: Partial<ReminderSettings>,
) => {
  commandRequest({
    action: "calendar/update_reminder",
    reminder_uuid: key,
    ...patch,
  }).catch(() => {
    shouldRemountEditor.value = !shouldRemountEditor.value;
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
      :reminders="reminderRows"
      :add-disabled="isRecurring"
      @add="addReminder"
      @update="updateReminder"
      @remove="removeReminder"
    />
    <p v-if="isRecurring" class="text-sm text-gray-500">
      Reminders for repeating events are coming soon.
    </p>
  </div>
</template>
