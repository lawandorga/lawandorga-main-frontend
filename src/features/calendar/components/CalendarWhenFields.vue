<script setup lang="ts">
import { FormInput } from "lorga-ui";
import { computed, watch } from "vue";

import { type EventType, RECURRENCE_FREQUENCIES } from "../constants";

const props = defineProps<{
  isAllDay: boolean;
  start: string;
  end: string;
  recurrenceRule: string;
  recurrenceUntil: string;
  eventType: EventType;
}>();

const emit = defineEmits<{
  "update:isAllDay": [value: boolean];
  "update:start": [value: string];
  "update:end": [value: string];
  "update:recurrenceRule": [value: string];
  "update:recurrenceUntil": [value: string];
}>();

const RECURRENCE_OPTIONS = [
  { value: "", label: "Never" },
  ...RECURRENCE_FREQUENCIES.map((frequency) => ({
    value: frequency.rule,
    label: frequency.label,
  })),
];

const DATE_LENGTH = 10; // length of a "YYYY-MM-DD" prefix
const MIDNIGHT_SUFFIX = "T00:00";

const toDatePart = (value: string): string =>
  (value ?? "").slice(0, DATE_LENGTH);

const toMidnightDateTime = (dateValue: string): string =>
  dateValue ? `${dateValue}${MIDNIGHT_SUFFIX}` : "";

const allDay = computed<boolean>({
  get: () => props.isAllDay,
  set: (value) => {
    emit("update:isAllDay", value);
    if (value) {
      // Collapse any chosen time to midnight so the stored value stays a
      // valid datetime once the time inputs are hidden.
      emit("update:start", toMidnightDateTime(toDatePart(props.start)));
      if (props.end) {
        emit("update:end", toMidnightDateTime(toDatePart(props.end)));
      }
    }
  },
});

const startDateTime = computed<string>({
  get: () => props.start,
  set: (value) => emit("update:start", value),
});

const endDateTime = computed<string>({
  get: () => props.end,
  set: (value) => emit("update:end", value),
});

const startDate = computed<string>({
  get: () => toDatePart(props.start),
  set: (value) => emit("update:start", toMidnightDateTime(value)),
});

const endDate = computed<string>({
  get: () => toDatePart(props.end),
  set: (value) => emit("update:end", toMidnightDateTime(value)),
});

const recurrenceRule = computed<string>({
  get: () => props.recurrenceRule,
  set: (value) => {
    emit("update:recurrenceRule", value);
    // A one-off event cannot have an "until" date.
    if (!value) emit("update:recurrenceUntil", "");
  },
});

const recurrenceUntil = computed<string>({
  get: () => props.recurrenceUntil,
  set: (value) => emit("update:recurrenceUntil", value),
});

const isRecurring = computed(() => !!props.recurrenceRule);

const isDeadline = computed<boolean>(() => props.eventType === "DEADLINE");

watch(
  isDeadline,
  (deadline) => {
    if (!deadline) return;
    if (!props.isAllDay) allDay.value = true;
    if (props.end) emit("update:end", "");
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-4">
    <template v-if="allDay">
      <FormInput
        v-model="startDate"
        name="start_time"
        type="date"
        :label="isDeadline ? 'Date' : 'Start date'"
        required
      />
      <FormInput
        v-if="!isDeadline"
        v-model="endDate"
        name="end_time"
        type="date"
        label="End date"
      />
    </template>
    <template v-else>
      <FormInput
        v-model="startDateTime"
        name="start_time"
        type="datetime-local"
        label="Start time"
        required
      />
      <FormInput
        v-model="endDateTime"
        name="end_time"
        type="datetime-local"
        label="End time"
      />
    </template>

    <div class="flex items-center justify-between gap-3">
      <label
        class="flex items-center gap-2 text-sm font-medium text-gray-700 select-none"
        :class="isDeadline ? 'cursor-not-allowed' : 'cursor-pointer'"
        :title="isDeadline ? 'Deadlines are always all-day events.' : undefined"
      >
        <input
          v-model="allDay"
          type="checkbox"
          class="size-4 disabled:opacity-60"
          :disabled="isDeadline"
          style="accent-color: var(--color-formcolor)"
        />
        All day
      </label>

      <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
        Repeat
        <select
          v-model="recurrenceRule"
          class="focus:border-formcolor focus:ring-formcolor rounded-md border border-gray-300 py-1 pr-8 pl-2 text-sm text-gray-700"
        >
          <option
            v-for="option in RECURRENCE_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <FormInput
      v-if="isRecurring"
      v-model="recurrenceUntil"
      name="recurrence_until"
      type="date"
      label="Repeat until"
    />
  </div>
</template>
