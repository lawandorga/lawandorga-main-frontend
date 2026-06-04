<script setup lang="ts">
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { ModalFree } from "lorga-ui";
import { computed } from "vue";

import type { CalendarEvent } from "../api/useCalendarEvents";
import CalendarDetailRow from "./CalendarDetailRow.vue";

const props = defineProps<{
  modelValue: boolean;
  event: CalendarEvent | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const EVENT_SOURCE_META = {
  PERSONAL: { label: "Personal", color: "#003c4d" },
  SHARED: { label: "Shared", color: "#5a3e8a" },
  ORGANIZATION: { label: "Organization", color: "#0f6e56" },
} as const;

const EVENT_TYPE_META = {
  APPOINTMENT: { label: "Appointment", color: "#2563eb" },
  TASK: { label: "Task", color: "#16a34a" },
  MEETING: { label: "Meeting", color: "#7c3aed" },
  DEADLINE: { label: "Deadline", color: "#dc2626" },
  EXTERNAL: { label: "External", color: "#d97706" },
} as const;

const eventTypeMeta = computed(() => EVENT_TYPE_META[props.event!.event_type]);

const eventColor = computed(() => eventTypeMeta.value.color);

const sourceMeta = computed(() => {
  // TODO: use actual source
  const meta = EVENT_SOURCE_META.PERSONAL;
  return {
    label: meta.label,
    style: {
      backgroundColor: `${meta.color}22`,
      color: meta.color,
      border: `1px solid ${meta.color}44`,
    },
  };
});

const formatTime = (value: string): string =>
  new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formattedDate = computed(() =>
  new Date(props.event!.start_time).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

const formattedTime = computed(() => {
  const event = props.event!;
  const start = formatTime(event.start_time);
  if (!event.end_time) return start;
  return `${start} - ${formatTime(event.end_time)}`;
});
</script>

<template>
  <ModalFree
    :model-value="modelValue"
    :title="event?.title ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="event">
      <div class="mb-5 flex gap-2">
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          :style="{
            backgroundColor: `${eventColor}20`,
            color: eventColor,
          }"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :style="{ backgroundColor: eventColor }"
          />
          {{ eventTypeMeta.label }}
        </span>
        <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :style="sourceMeta.style"
        >
          {{ sourceMeta.label }}
        </span>
      </div>

      <dl class="space-y-3 text-sm">
        <CalendarDetailRow label="Date" :icon="CalendarDaysIcon">
          <div>
            <dd class="text-gray-900">{{ formattedDate }}</dd>
            <dd class="text-gray-500">{{ formattedTime }}</dd>
          </div>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.location"
          label="Location"
          :icon="MapPinIcon"
        >
          <dd class="text-gray-900">{{ event.location }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.description"
          label="Description"
          :icon="DocumentTextIcon"
        >
          <dd class="whitespace-pre-wrap text-gray-900">
            {{ event.description }}
          </dd>
        </CalendarDetailRow>
        <CalendarDetailRow label="Creator" :icon="UserIcon">
          <dd class="text-gray-900">{{ event.creator_name }}</dd>
        </CalendarDetailRow>
      </dl>

      <div class="mt-5 flex gap-3">
        <button
          type="button"
          class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          @click="emit('update:modelValue', false)"
        >
          Close
        </button>
        <button
          type="button"
          class="bg-formcolor flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:bg-formcolor/90"
        >
          Edit
        </button>
      </div>
    </template>
  </ModalFree>
</template>
