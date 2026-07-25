<script setup lang="ts">
import type {
  CalendarOptions,
  DateSelectArg,
  DayHeaderContentArg,
  EventApi,
  EventClickArg,
  EventContentArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import enGBLocale from "@fullcalendar/core/locales/en-gb";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
  type EventResizeDoneArg,
} from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useCmd from "@/composables/useCmd";
import { useAlertStore } from "@/store/alert";
import { useUserStore } from "@/store/user";
import { addDays, toLocalDateTimeInput } from "@/utils/date";

import CreateEvent from "../actions/CreateEvent.vue";
import {
  occurrenceToFullCalendarEvent,
  readOccurrenceProps,
} from "../api/occurrenceToFullCalendarEvent";
import {
  useCalendarEvents,
  useCalendarOccurrences,
  type CalendarEvent,
  type OccurrenceRange,
} from "../api/useCalendarEvents";
import CalendarEventDetail from "../components/CalendarEventDetail.vue";
import CalendarFiltersPanel from "../components/CalendarFiltersPanel.vue";
import EventScopeModal from "../components/EventScopeModal.vue";
import {
  EVENT_SOURCE_META,
  EVENT_TYPE_META,
  type EventSource,
  type EventType,
} from "../constants";
import { getEventAccessKind } from "../utils/eventAccess";
import {
  isRecurring,
  seriesTimesShiftedByOccurrenceMove,
} from "../utils/occurrences";

const CALENDAR_PLUGINS = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
];

const visibleRange = ref<OccurrenceRange | null>(null);

const { isLoading, calendarEvents, query: queryEvents } = useCalendarEvents();
const { occurrences: rangeOccurrences, query: queryOccurrences } =
  useCalendarOccurrences(visibleRange);

const refresh = () => {
  queryEvents();
  queryOccurrences();
};

const { commandRequest: updateEventRequest } = useCmd(refresh);

const alertStore = useAlertStore();
const userStore = useUserStore();

const createEventModal = ref<InstanceType<typeof CreateEvent> | null>(null);

const selectedEventUuid = ref<string | null>(null);
const selectedEvent = computed<CalendarEvent | null>(
  () =>
    (calendarEvents.value ?? []).find(
      (event) => event.uuid === selectedEventUuid.value,
    ) ?? null,
);
// null for one-off events (no distinct occurrence) and when nothing is selected
const selectedOriginalStart = ref<string | null>(null);
const detailOpen = ref(false);

const route = useRoute();
const router = useRouter();

const openEventFromRoute = (eventUuid: unknown, originalStart: unknown) => {
  if (typeof eventUuid !== "string") return;

  const matchingEvent = (calendarEvents.value ?? []).find(
    (event) => event.uuid === eventUuid,
  );
  if (!matchingEvent) return;

  selectedEventUuid.value = eventUuid;
  selectedOriginalStart.value =
    typeof originalStart === "string" ? originalStart : null;
  detailOpen.value = true;

  const remainingQuery = { ...route.query };
  delete remainingQuery.event;
  delete remainingQuery.start;
  void router.replace({ query: remainingQuery });
};

watch(
  [() => route.query.event, () => route.query.start, calendarEvents],
  ([eventUuid, originalStart]) => {
    openEventFromRoute(eventUuid, originalStart);
  },
  { immediate: true },
);

const eventTypeFilterKeys = Object.keys(EVENT_TYPE_META) as EventType[];
const accessFilterKeys = Object.keys(EVENT_SOURCE_META) as EventSource[];

const selectedEventTypes = ref<Set<EventType>>(new Set(eventTypeFilterKeys));
const selectedAccessKinds = ref<Set<EventSource>>(new Set(accessFilterKeys));

const eventsByUuid = computed(() => {
  const map = new Map<string, CalendarEvent>();
  for (const event of calendarEvents.value ?? []) map.set(event.uuid, event);
  return map;
});

const visibleEventUuids = computed(
  () =>
    new Set(
      (calendarEvents.value ?? [])
        .filter(
          (event) =>
            selectedEventTypes.value.has(event.event_type) &&
            selectedAccessKinds.value.has(getEventAccessKind(event)),
        )
        .map((event) => event.uuid),
    ),
);

const displayedEvents = computed<EventInput[]>(() => {
  const currentUserId = userStore.user?.id;
  return rangeOccurrences.value
    .filter((occurrence) => visibleEventUuids.value.has(occurrence.event_uuid))
    .map((occurrence) =>
      occurrenceToFullCalendarEvent(
        occurrence,
        eventsByUuid.value.get(occurrence.event_uuid),
        currentUserId,
      ),
    );
});

const totalEventsCount = computed(() => (calendarEvents.value ?? []).length);

const filteredEventsCount = computed(() => visibleEventUuids.value.size);

const formatWeekday = (date: Date): string =>
  date.toLocaleString("en-GB", { weekday: "short" }).slice(0, 2).toUpperCase();

const onEventClick = (props: EventClickArg) => {
  const occurrenceProps = readOccurrenceProps(props.event);
  if (!occurrenceProps) return;
  selectedEventUuid.value = occurrenceProps.eventUuid;
  selectedOriginalStart.value = occurrenceProps.originalStart;
  detailOpen.value = true;
};

const onDateClick = (click: DateClickArg) => {
  createEventModal.value?.open({ start: click.date, allDay: click.allDay });
};

const onDateSelect = (selection: DateSelectArg) => {
  createEventModal.value?.open({
    start: selection.start,
    // An all-day selection's end is exclusive in FullCalendar, we want to show the last day the user selected
    end: selection.allDay ? addDays(selection.end, -1) : selection.end,
    allDay: selection.allDay,
  });
  selection.view.calendar.unselect();
};

const persistEventTimes = (
  event: EventApi,
  eventUuid: string,
  revert: () => void,
) => {
  if (!event.start) return;
  // FullCalendar's end date is exclusive, we want inclusive ones
  const end = event.allDay && event.end ? addDays(event.end, -1) : event.end;
  updateEventRequest({
    action: "calendar/update_event",
    event_uuid: eventUuid,
    is_all_day: event.allDay,
    start_time: toLocalDateTimeInput(event.start.toISOString()),
    end_time: end ? toLocalDateTimeInput(end.toISOString()) : null,
  })
    .then(() => alertStore.showSuccess("Event updated"))
    .catch(revert);
};

interface PendingReschedule {
  parentEvent: CalendarEvent;
  originalStart: string;
  newStart: Date;
  newEndInclusive: Date | null;
  isAllDay: boolean;
  revert: () => void;
}

const pendingReschedule = ref<PendingReschedule | null>(null);
const rescheduleModalOpen = ref(false);

const handleReschedule = (event: EventApi, revert: () => void) => {
  const occurrenceProps = readOccurrenceProps(event);
  if (!event.start || !occurrenceProps) {
    revert();
    return;
  }
  const parentEvent = eventsByUuid.value.get(occurrenceProps.eventUuid);
  if (!parentEvent) {
    revert();
    return;
  }
  if (!isRecurring(parentEvent)) {
    persistEventTimes(event, occurrenceProps.eventUuid, revert);
    return;
  }
  pendingReschedule.value = {
    parentEvent,
    originalStart: occurrenceProps.originalStart,
    newStart: event.start,
    newEndInclusive:
      event.allDay && event.end ? addDays(event.end, -1) : event.end,
    isAllDay: event.allDay,
    revert,
  };
  rescheduleModalOpen.value = true;
};

const thisOccurrencePayload = (pending: PendingReschedule) => ({
  action: "calendar/update_event_occurrence",
  event_uuid: pending.parentEvent.uuid,
  original_start: pending.originalStart,
  start_time: toLocalDateTimeInput(pending.newStart.toISOString()),
  end_time: pending.newEndInclusive
    ? toLocalDateTimeInput(pending.newEndInclusive.toISOString())
    : null,
});

const wholeSeriesPayload = (pending: PendingReschedule) => {
  const shifted = seriesTimesShiftedByOccurrenceMove({
    originalStart: pending.originalStart,
    seriesStart: pending.parentEvent.start_time,
    newStart: pending.newStart.toISOString(),
    newEnd: pending.newEndInclusive
      ? pending.newEndInclusive.toISOString()
      : null,
  });
  return {
    action: "calendar/update_event",
    event_uuid: pending.parentEvent.uuid,
    is_all_day: pending.isAllDay,
    start_time: toLocalDateTimeInput(shifted.start),
    end_time: shifted.end ? toLocalDateTimeInput(shifted.end) : null,
  };
};

const onRescheduleScope = (scope: "this" | "all") => {
  const pending = pendingReschedule.value;
  if (!pending) return;
  const payload =
    scope === "this"
      ? thisOccurrencePayload(pending)
      : wholeSeriesPayload(pending);
  const successMessage =
    scope === "this" ? "Event updated" : "All events updated";
  // clear before closing, otherwise the dismiss-watch also reverts the drag
  pendingReschedule.value = null;
  rescheduleModalOpen.value = false;
  updateEventRequest(payload)
    .then(() => alertStore.showSuccess(successMessage))
    .catch(pending.revert);
};

watch(rescheduleModalOpen, (open) => {
  if (!open && pendingReschedule.value) {
    pendingReschedule.value.revert();
    pendingReschedule.value = null;
  }
});

const onEventDrop = (drop: EventDropArg) =>
  handleReschedule(drop.event, drop.revert);

const onEventResize = (resize: EventResizeDoneArg) =>
  handleReschedule(resize.event, resize.revert);

const isoWeekNumber = (date: Date): number => {
  const millisecondsPerDay = 86400000;
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayOfWeek = utcDate.getUTCDay() || 7;
  // According to ISO 8601, week 1 is the one containing the first Thursday (day 4) of the year
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayOfWeek);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / millisecondsPerDay + 1) / 7,
  );
};

const monthViewDayHeader = (date: Date) => {
  const weekdayElement = document.createElement("span");
  weekdayElement.className = "calendar-month-header__weekday";
  weekdayElement.textContent = date
    .toLocaleString("en-GB", { weekday: "short" })
    .toUpperCase();
  return { domNodes: [weekdayElement] };
};

const listViewDayHeader = (date: Date) => {
  const dateElement = document.createElement("span");
  dateElement.className = "calendar-list-day-header";
  dateElement.textContent = date
    .toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
  return { domNodes: [dateElement] };
};

const gridViewDayHeader = (props: DayHeaderContentArg) => {
  const dayHeaderElement = document.createElement("div");
  dayHeaderElement.className = "calendar-day-header";

  const weekdayElement = document.createElement("span");
  weekdayElement.className = "calendar-day-header__title";
  weekdayElement.textContent = formatWeekday(props.date);

  const dayNumberElement = document.createElement("div");
  dayNumberElement.className = props.isToday
    ? "calendar-day-header__date calendar-day-header__date--today"
    : "calendar-day-header__date";
  dayNumberElement.textContent = String(props.date.getDate());

  dayHeaderElement.append(weekdayElement, dayNumberElement);
  return { domNodes: [dayHeaderElement] };
};

const dayHeaderContent = (props: DayHeaderContentArg) => {
  if (props.view.type === "dayGridMonth") return monthViewDayHeader(props.date);
  if (props.view.type === "listMonth") return listViewDayHeader(props.date);
  return gridViewDayHeader(props);
};

const listViewEventContent = (
  event: CalendarEvent,
  titleElement: HTMLDivElement,
) => {
  const metaParts = event.location
    ? [event.location, event.creator_name]
    : [event.creator_name];
  const metaElement = document.createElement("div");
  metaElement.className = "calendar-event__meta";
  metaElement.textContent = metaParts.join(" · ");
  return { domNodes: [titleElement, metaElement] };
};

const gridViewEventContent = (
  event: CalendarEvent,
  titleElement: HTMLDivElement,
) => {
  const creatorElement = document.createElement("div");
  creatorElement.className = "calendar-event__meta";
  creatorElement.textContent = event.creator_name;

  const domNodes: HTMLElement[] = [titleElement, creatorElement];

  if (event.location) {
    const locationElement = document.createElement("div");
    locationElement.className = "calendar-event__meta";
    locationElement.textContent = event.location;
    domNodes.push(locationElement);
  }

  return { domNodes };
};

const eventContent = (props: EventContentArg) => {
  const occurrenceProps = readOccurrenceProps(props.event);
  // the drag-to-create preview has no event yet, so just show an empty div
  if (!occurrenceProps) return { domNodes: [] };
  const event = eventsByUuid.value.get(occurrenceProps.eventUuid);

  const titleElement = document.createElement("div");
  titleElement.className = "calendar-event__title";
  titleElement.textContent = props.event.title;

  if (!event || props.view.type === "dayGridMonth")
    return { domNodes: [titleElement] };
  if (props.view.type === "listMonth")
    return listViewEventContent(event, titleElement);
  if (props.event.allDay) return { domNodes: [titleElement] };
  return gridViewEventContent(event, titleElement);
};

const calendarBaseOptions: CalendarOptions = {
  plugins: CALENDAR_PLUGINS,
  initialView: "timeGridWeek",
  headerToolbar: {
    left: "prev today next title",
    center: "",
    right: "timeGridWeek,dayGridMonth,listMonth,timeGridDay createEvent",
  },
  buttonText: {
    today: "Today",
    week: "Week",
    month: "Month",
    day: "Day",
    list: "List",
  },
  views: {
    timeGridWeek: {
      titleFormat: (range) => {
        const weekStart = range.start.marker;
        const month = weekStart.toLocaleString("en-GB", { month: "long" });
        return `CW ${isoWeekNumber(weekStart)} · ${month} ${weekStart.getFullYear()}`;
      },
    },
    listMonth: {
      titleFormat: (range) => {
        const monthStart = range.start.marker;
        const month = monthStart.toLocaleString("en-GB", { month: "long" });
        return `${month} ${monthStart.getFullYear()}`;
      },
    },
  },
  customButtons: {
    createEvent: {
      text: "Create Event",
      click: () => {
        createEventModal.value?.open();
      },
    },
  },
  locale: enGBLocale,
  firstDay: 1,
  height: "100%",
  nowIndicator: true,
  eventDisplay: "block",
  expandRows: true,
  editable: false,
  selectable: true,
  selectMirror: true,
  // 5px threshold between a click and a drag event
  selectMinDistance: 5,
  allDaySlot: true,
  allDayText: "All day",
  scrollTime: "07:00:00",
  slotLabelFormat: { hour: "numeric", minute: "2-digit", hour12: false },
  dayHeaderContent,
  eventContent,
  eventClick: onEventClick,
  dateClick: onDateClick,
  select: onDateSelect,
  eventDrop: onEventDrop,
  eventResize: onEventResize,
  // fires on first render and every navigation, so it drives the range fetch
  datesSet: (arg) => {
    visibleRange.value = { from: arg.startStr, to: arg.endStr };
  },
};

const calendarOptions = computed<CalendarOptions>(() => ({
  ...calendarBaseOptions,
  events: displayedEvents.value,
}));
</script>

<template>
  <div
    class="calendar-page mx-auto flex h-full max-w-(--breakpoint-2xl) flex-col gap-6"
  >
    <BreadcrumbsBar :base="{ name: 'calendar-dashboard' }" :pages="[]">
      <CalendarDaysIcon class="h-6 w-6" />
    </BreadcrumbsBar>

    <div
      class="calendar-shell relative isolate min-h-0 flex-1 rounded-lg bg-white p-3 shadow lg:p-4"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70"
      >
        <span class="text-sm text-gray-400">Loading…</span>
      </div>

      <div
        class="calendar-layout flex h-full min-h-0 flex-col gap-3 lg:flex-row"
      >
        <CalendarFiltersPanel
          :calendar-events="calendarEvents ?? []"
          :total-events-count="totalEventsCount"
          :filtered-events-count="filteredEventsCount"
          :event-type-filter-keys="eventTypeFilterKeys"
          :access-filter-keys="accessFilterKeys"
          :selected-event-types="selectedEventTypes"
          :selected-access-kinds="selectedAccessKinds"
          @update:selected-event-types="selectedEventTypes = $event"
          @update:selected-access-kinds="selectedAccessKinds = $event"
        />

        <div
          class="relative min-h-155 min-w-0 flex-1 rounded-[14px] border border-slate-200 bg-white p-1.5 lg:min-h-0"
        >
          <FullCalendar :options="calendarOptions" />

          <div
            v-if="!isLoading && filteredEventsCount === 0"
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-gray-500"
          >
            <p class="text-[15px] font-semibold text-slate-700">
              No events match these filters
            </p>
            <p class="text-xs">Try turning on more event or access kinds.</p>
          </div>
        </div>
      </div>
    </div>

    <CreateEvent ref="createEventModal" :query="refresh" />

    <CalendarEventDetail
      v-model="detailOpen"
      :event="selectedEvent"
      :original-start="selectedOriginalStart"
      :query="refresh"
    />

    <EventScopeModal
      v-model="rescheduleModalOpen"
      title="Change repeating event"
      question="Do you want to change only this event or all events in this series?"
      @select="onRescheduleScope"
    />
  </div>
</template>

<style scoped>
.calendar-shell {
  --fc-today-bg-color: rgba(0, 60, 77, 0.07);
  --fc-neutral-bg-color: #f7f7f4;
  --fc-list-event-hover-bg-color: white;

  --color-formcolor-hover: #005068;
  --color-muted: #9ca3af;
  --color-subtle-bg: #fafaf8;
  --color-button-border: #e2e2de;
}

/* Toolbar */
:deep(.fc-toolbar-chunk) {
  display: flex;
  align-items: center;
}

:deep(.fc-toolbar-title) {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-formcolor);
  white-space: nowrap;
}

:deep(.fc) {
  height: 100%;

  .fc-button-primary {
    background-color: var(--fc-neutral-bg-color);
    border-color: var(--color-button-border);
    color: #374151;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 6px;

    &:not(:disabled):hover {
      background-color: var(--color-button-border);
      border-color: var(--color-button-border);
      color: #374151;
    }

    &.fc-button-active {
      background-color: var(--color-formcolor);
      border-color: var(--color-formcolor);
      color: #fff;
      font-weight: 500;
      z-index: 2;

      &:not(:disabled):hover {
        background-color: var(--color-formcolor-hover);
        border-color: var(--color-formcolor-hover);
        color: #fff;
      }
    }
  }

  .fc-createEvent-button.fc-button-primary {
    background-color: var(--color-formcolor);
    border-color: var(--color-formcolor);
    color: #fff;
    font-weight: 500;

    &:hover {
      background-color: var(--color-formcolor-hover);
      border-color: var(--color-formcolor-hover);
      color: #fff;
    }
  }

  .fc-button:focus:not(:focus-visible) {
    box-shadow: none;
    outline: none;
  }
}

/* Week / Day view */
:deep(.calendar-day-header) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 0;

  .calendar-day-header__title {
    font-size: 10px;
    font-weight: 500;
    color: var(--color-muted);
  }

  .calendar-day-header__date {
    font-size: 17px;
    font-weight: 300;
    color: var(--color-formcolor);

    &.calendar-day-header__date--today {
      font-size: 14px;
      font-weight: 500;
      background: var(--color-formcolor);
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

:deep(.fc-day-sat),
:deep(.fc-day-sun) {
  background-color: var(--color-subtle-bg);
}

:deep(.fc-timegrid-slot-label-cushion) {
  font-size: 10px;
  color: var(--color-muted);
  padding-right: 6px;
}

:deep(.fc-timegrid-axis-cushion) {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding-right: 6px;
}

:deep(.fc-v-event),
:deep(.fc-h-event) {
  border: none;
  border-left: 3px solid var(--fc-event-border-color);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

:deep(.fc-v-event:hover),
:deep(.fc-h-event:hover) {
  filter: brightness(0.93);
}

:deep(.calendar-event__title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

:deep(.calendar-event__meta) {
  font-size: 0.75em;
  opacity: 0.75;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Month view */
:deep(.calendar-month-header__weekday) {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.05em;
  padding: 6px 0;
}

:deep(.fc-daygrid-day-top) {
  flex-direction: row;
}

:deep(.fc-daygrid-day-number) {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-formcolor);
  padding: 4px 8px;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  background: var(--color-formcolor);
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 4px 8px;
}

:deep(.fc-day-other) {
  background-color: var(--color-subtle-bg);

  .fc-daygrid-day-number {
    color: #d1d5db;
  }
}

:deep(.fc-daygrid-event) {
  font-size: 11px;
  padding: 1px 2px;
}

/* List view */
:deep(.fc-list-day th) {
  text-align: left;
}

:deep(.calendar-list-day-header) {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.05em;
}

:deep(.fc-list-event) {
  cursor: pointer;
}
</style>
