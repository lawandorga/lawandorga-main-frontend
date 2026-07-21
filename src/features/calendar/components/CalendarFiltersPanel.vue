<script setup lang="ts">
import { computed } from "vue";
import { ButtonNormal } from "lorga-ui";

import type { CalendarEvent } from "../api/useCalendarEvents";
import {
  EVENT_SOURCE_META,
  EVENT_TYPE_META,
  type EventSource,
  type EventType,
} from "../constants";
import { getEventAccessKind } from "../utils/eventAccess";

interface FilterOption<T> {
  value: T;
  label: string;
  color: string;
  selected: boolean;
  count: number;
}

const props = defineProps<{
  calendarEvents: CalendarEvent[];
  totalEventsCount: number;
  filteredEventsCount: number;
  eventTypeFilterKeys: EventType[];
  accessFilterKeys: EventSource[];
  selectedEventTypes: Set<EventType>;
  selectedAccessKinds: Set<EventSource>;
}>();

const emit = defineEmits<{
  "update:selected-event-types": [value: Set<EventType>];
  "update:selected-access-kinds": [value: Set<EventSource>];
}>();

const toggleEventType = (eventType: EventType) => {
  const next = new Set(props.selectedEventTypes);
  if (next.has(eventType)) {
    next.delete(eventType);
  } else {
    next.add(eventType);
  }
  emit("update:selected-event-types", next);
};

const toggleAccessKind = (accessKind: EventSource) => {
  const next = new Set(props.selectedAccessKinds);
  if (next.has(accessKind)) {
    next.delete(accessKind);
  } else {
    next.add(accessKind);
  }
  emit("update:selected-access-kinds", next);
};

const resetFilters = () => {
  if (!hasActiveFilters.value) return;
  emit("update:selected-event-types", new Set(props.eventTypeFilterKeys));
  emit("update:selected-access-kinds", new Set(props.accessFilterKeys));
};

const hasActiveFilters = computed(
  () =>
    props.selectedEventTypes.size !== props.eventTypeFilterKeys.length ||
    props.selectedAccessKinds.size !== props.accessFilterKeys.length,
);

const eventTypeCounts = computed(() => {
  const counts = new Map<EventType, number>(
    props.eventTypeFilterKeys.map((eventType) => [eventType, 0]),
  );

  for (const event of props.calendarEvents) {
    counts.set(event.event_type, (counts.get(event.event_type) ?? 0) + 1);
  }

  return counts;
});

const accessKindCounts = computed(() => {
  const counts = new Map<EventSource, number>(
    props.accessFilterKeys.map((accessKind) => [accessKind, 0]),
  );

  for (const event of props.calendarEvents) {
    const accessKind = getEventAccessKind(event);
    counts.set(accessKind, (counts.get(accessKind) ?? 0) + 1);
  }

  return counts;
});

const eventTypeFilters = computed<FilterOption<EventType>[]>(() =>
  props.eventTypeFilterKeys.map((eventType) => ({
    value: eventType,
    label: EVENT_TYPE_META[eventType].label,
    color: EVENT_TYPE_META[eventType].color,
    selected: props.selectedEventTypes.has(eventType),
    count: eventTypeCounts.value.get(eventType) ?? 0,
  })),
);

const accessFilters = computed<FilterOption<EventSource>[]>(() =>
  props.accessFilterKeys.map((accessKind) => ({
    value: accessKind,
    label:
      accessKind === "ORGANIZATION"
        ? "Org"
        : EVENT_SOURCE_META[accessKind].label,
    color: EVENT_SOURCE_META[accessKind].color,
    selected: props.selectedAccessKinds.has(accessKind),
    count: accessKindCounts.value.get(accessKind) ?? 0,
  })),
);
</script>

<template>
  <aside
    class="w-full shrink-0 rounded-[14px] border border-slate-300 bg-linear-to-br from-zinc-50 to-gray-100 p-4 lg:w-72"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase"
        >
          Filters
        </p>
        <p class="mt-0.5 text-[13px] text-slate-700">
          {{ props.filteredEventsCount }} of {{ props.totalEventsCount }} events
        </p>
      </div>

      <ButtonNormal
        kind="action"
        :class="!hasActiveFilters ? 'pointer-events-none opacity-45' : ''"
        @click="resetFilters"
      >
        Reset
      </ButtonNormal>
    </div>

    <section class="mt-4.5 flex flex-col gap-2.5">
      <h3 class="text-xs font-semibold text-gray-600">Event Kind</h3>
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="filter in eventTypeFilters"
          :key="filter.value"
          type="button"
          :aria-pressed="filter.selected"
          :class="[
            'flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition duration-200 ease-out hover:-translate-y-px',
            filter.selected
              ? 'border-formcolor bg-formcolor font-medium text-white shadow-[0_8px_22px_-20px_rgba(0,60,77,0.9)] hover:border-(--color-formcolor-hover) hover:bg-(--color-formcolor-hover)'
              : 'border-(--color-button-border) bg-(--fc-neutral-bg-color) text-gray-700 hover:border-(--color-button-border) hover:bg-(--color-button-border)',
          ]"
          @click="toggleEventType(filter.value)"
        >
          <span
            class="size-2.25 shrink-0 rounded-full"
            :style="{ backgroundColor: filter.color }"
          />
          <span class="text-xs">{{ filter.label }}</span>
          <span
            :class="[
              'ml-auto min-w-5.5 rounded-full px-1.5 py-0.5 text-center text-[11px]',
              filter.selected
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500',
            ]"
            >{{ filter.count }}</span
          >
        </button>
      </div>
    </section>

    <section class="mt-4.5 flex flex-col gap-2.5">
      <h3 class="text-xs font-semibold text-gray-600">Access Kind</h3>
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="filter in accessFilters"
          :key="filter.value"
          type="button"
          :aria-pressed="filter.selected"
          :class="[
            'flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition duration-200 ease-out hover:-translate-y-px',
            filter.selected
              ? 'border-formcolor bg-formcolor font-medium text-white shadow-[0_8px_22px_-20px_rgba(0,60,77,0.9)] hover:border-(--color-formcolor-hover) hover:bg-(--color-formcolor-hover)'
              : 'border-(--color-button-border) bg-(--fc-neutral-bg-color) text-gray-700 hover:border-(--color-button-border) hover:bg-(--color-button-border)',
          ]"
          @click="toggleAccessKind(filter.value)"
        >
          <span
            class="size-2.25 shrink-0 rounded-full"
            :style="{ backgroundColor: filter.color }"
          />
          <span class="text-xs">{{ filter.label }}</span>
          <span
            :class="[
              'ml-auto min-w-5.5 rounded-full px-1.5 py-0.5 text-center text-[11px]',
              filter.selected
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500',
            ]"
            >{{ filter.count }}</span
          >
        </button>
      </div>
    </section>
  </aside>
</template>
