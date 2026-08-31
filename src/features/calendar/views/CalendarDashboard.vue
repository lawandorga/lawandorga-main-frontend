<script setup lang="ts">
import FullCalendar, {
  joinClassNames,
  type ButtonInfo,
  type CalendarOptions,
  type ClassNameInput,
  type DateClickInfo,
  type DateSelectInfo,
  type DayCellInfo,
  type DayHeaderInfo,
  type EventApi,
  type EventClickInfo,
  type EventDisplayInfo,
  type EventDropInfo,
  type EventInput,
  type EventResizeDoneInfo,
} from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/vue3/daygrid";
import interactionPlugin from "@fullcalendar/vue3/interaction";
import listPlugin from "@fullcalendar/vue3/list";
import enGBLocale from "@fullcalendar/vue3/locales/en-gb";
import classicThemePlugin from "@fullcalendar/vue3/themes/classic";
import timeGridPlugin from "@fullcalendar/vue3/timegrid";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import "@fullcalendar/vue3/skeleton.css";
import "@fullcalendar/vue3/themes/classic/theme.css";
import "@fullcalendar/vue3/themes/classic/palette.css";

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

const EVENT_SOURCE_ACCENT_CLASS: Record<EventSource, string> = {
  PERSONAL: "calendar-event--source-personal",
  SHARED: "calendar-event--source-shared",
  ORGANIZATION: "calendar-event--source-organization",
};

const EVENT_SOURCE_ACCENT_VARIABLES = Object.fromEntries(
  Object.entries(EVENT_SOURCE_META).map(([source, meta]) => [
    `--calendar-accent-${source.toLowerCase()}`,
    meta.color,
  ]),
);

const CALENDAR_PLUGINS = [
  classicThemePlugin,
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

const onEventClick = (props: EventClickInfo) => {
  const occurrenceProps = readOccurrenceProps(props.event);
  if (!occurrenceProps) return;
  selectedEventUuid.value = occurrenceProps.eventUuid;
  selectedOriginalStart.value = occurrenceProps.originalStart;
  detailOpen.value = true;
};

const onDateClick = (click: DateClickInfo) => {
  createEventModal.value?.open({ start: click.date, allDay: click.allDay });
};

const onDateSelect = (selection: DateSelectInfo) => {
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

const onEventDrop = (drop: EventDropInfo) =>
  handleReschedule(drop.event, drop.revert);

const onEventResize = (resize: EventResizeDoneInfo) =>
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

const WEEKEND_DAYS_OF_WEEK = [0, 6];

const weekendClass = (day: { dow: number }): ClassNameInput =>
  WEEKEND_DAYS_OF_WEEK.includes(day.dow) && "calendar-weekend";

const dayCellClass = (cell: DayCellInfo): ClassNameInput =>
  joinClassNames(
    weekendClass(cell),
    cell.isOther && "calendar-day-cell--other",
  );

const dayNumberClass = (cell: DayCellInfo): ClassNameInput =>
  joinClassNames(
    "calendar-day-number",
    cell.isToday && "calendar-day-number--today",
    cell.isOther && "calendar-day-number--other",
  );

const buttonClass = (button: ButtonInfo): ClassNameInput =>
  joinClassNames(
    "calendar-button",
    button.isSelected && "calendar-button--selected",
  );

const eventClass = (event: EventDisplayInfo): ClassNameInput =>
  EVENT_SOURCE_ACCENT_CLASS[
    event.event.extendedProps.eventSource as EventSource
  ];

const textElement = (tag: string, className: string, text: string) => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

const gridViewDayHeader = (props: DayHeaderInfo) => {
  const dayHeaderElement = document.createElement("div");
  dayHeaderElement.className = "calendar-day-header";

  dayHeaderElement.append(
    textElement(
      "span",
      "calendar-day-header__title",
      props.date.toLocaleString("en-GB", { weekday: "short" }).toUpperCase(),
    ),
    textElement(
      "div",
      props.isToday
        ? "calendar-day-header__date calendar-day-header__date--today"
        : "calendar-day-header__date",
      String(props.date.getDate()),
    ),
  );

  return { domNodes: [dayHeaderElement] };
};

const dayHeaderContent = (props: DayHeaderInfo) =>
  props.view.type === "dayGridMonth" ? true : gridViewDayHeader(props);

const listViewEventContent = (
  event: CalendarEvent,
  titleElement: HTMLElement,
) => {
  const metaParts = event.location
    ? [event.location, event.creator_name]
    : [event.creator_name];
  return {
    domNodes: [
      titleElement,
      textElement("div", "calendar-event__meta", metaParts.join(" · ")),
    ],
  };
};

const gridViewEventContent = (
  event: CalendarEvent,
  titleElement: HTMLElement,
) => {
  const domNodes = [
    titleElement,
    textElement("div", "calendar-event__meta", event.creator_name),
  ];

  if (event.location) {
    domNodes.push(textElement("div", "calendar-event__meta", event.location));
  }

  return { domNodes };
};

const eventContent = (props: EventDisplayInfo) => {
  const occurrenceProps = readOccurrenceProps(props.event);
  // the drag-to-create preview has no event yet, so just show an empty div
  if (!occurrenceProps) return { domNodes: [] };
  const event = eventsByUuid.value.get(occurrenceProps.eventUuid);

  const titleElement = textElement(
    "div",
    "calendar-event__title",
    props.event.title,
  );

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
  buttons: {
    createEvent: {
      text: "Create Event",
      class: "calendar-button--primary",
      click: () => {
        createEventModal.value?.open();
      },
    },
  },
  views: {
    timeGridWeek: {
      titleFormat: (range) => {
        const weekStart = range.start.marker;
        const month = weekStart.toLocaleString("en-GB", { month: "long" });
        return `CW ${isoWeekNumber(weekStart)} · ${month} ${weekStart.getFullYear()}`;
      },
    },
    dayGridMonth: {
      dayHeaderFormat: { weekday: "short" },
      dayHeaderInnerClass: "calendar-month-header__weekday",
    },
    listMonth: {
      titleFormat: { month: "long", year: "numeric" },
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
  slotHeaderFormat: { hour: "numeric", minute: "2-digit", hour12: false },
  toolbarTitleClass: "calendar-toolbar-title",
  buttonClass,
  dayHeaderClass: weekendClass,
  dayCellClass,
  dayLaneClass: weekendClass,
  dayCellTopInnerClass: dayNumberClass,
  slotHeaderInnerClass: "calendar-slot-label",
  allDayHeaderInnerClass: "calendar-allday-label",
  eventClass,
  blockEventClass: "calendar-event",
  rowEventClass: "calendar-event--compact",
  listItemEventClass: "calendar-list-event",
  listDayFormat: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
  listDayHeaderInnerClass: "calendar-list-day-header",
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
      :style="EVENT_SOURCE_ACCENT_VARIABLES"
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
  --fc-classic-today: rgba(0, 60, 77, 0.07);

  --color-formcolor-hover: #005068;
  --color-muted: #9ca3af;
  --color-neutral-bg: #f7f7f4;
  --color-subtle-bg: #fafaf8;
  --color-weekend-bg: rgb(0 0 0 / 2%);
  --color-button-border: #e2e2de;
}

/* Toolbar */
:deep(.calendar-toolbar-title) {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-formcolor);
  white-space: nowrap;
}

:deep(.calendar-button) {
  background-color: var(--color-neutral-bg);
  border-color: var(--color-button-border);
  color: #374151;
  font-size: 12px;
  padding: 6px 12px;

  &:not(:disabled):hover {
    background-color: var(--color-button-border);
    border-color: var(--color-button-border);
    color: #374151;
  }

  &.calendar-button--selected,
  &.calendar-button--primary {
    background-color: var(--color-formcolor);
    border-color: var(--color-formcolor);
    color: #fff;
    font-weight: 500;

    &:not(:disabled):hover {
      background-color: var(--color-formcolor-hover);
      border-color: var(--color-formcolor-hover);
      color: #fff;
    }
  }

  &.calendar-button--selected {
    z-index: 2;
  }

  &:focus:not(:focus-visible) {
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

:deep(.calendar-weekend) {
  background-color: var(--color-weekend-bg);
}

:deep(.calendar-slot-label) {
  font-size: 10px;
  color: var(--color-muted);
  padding-right: 6px;
}

:deep(.calendar-allday-label) {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding-right: 6px;
}

:deep(.calendar-event) {
  border: none;
  border-left: 3px solid var(--fc-event-contrast-color);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    filter: brightness(0.93);
  }
}

:deep(.calendar-event--source-personal) {
  border-left-color: var(--calendar-accent-personal);
}

:deep(.calendar-event--source-shared) {
  border-left-color: var(--calendar-accent-shared);
}

:deep(.calendar-event--source-organization) {
  border-left-color: var(--calendar-accent-organization);
}

:deep(.calendar-event--compact) {
  font-size: 11px;
  padding: 1px 2px;
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
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.05em;
  padding: 6px 0;
}

:deep(.calendar-day-number) {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-formcolor);
  padding: 4px 8px;

  &.calendar-day-number--today {
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

  &.calendar-day-number--other {
    color: #d1d5db;
  }
}

:deep(.calendar-day-cell--other) {
  background-color: var(--color-subtle-bg);
}

/* List view */
:deep(.calendar-list-day-header) {
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.05em;
}

:deep(.calendar-list-event) {
  cursor: pointer;

  &:hover {
    background-color: #fff;
  }
}
</style>
