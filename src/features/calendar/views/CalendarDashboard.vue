<script setup lang="ts">
import type {
  CalendarOptions,
  DateSelectArg,
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import enGBLocale from "@fullcalendar/core/locales/en-gb";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { addDays } from "@/utils/date";

import CreateEvent from "../actions/CreateEvent.vue";
import {
  useCalendarEvents,
  type CalendarEvent,
} from "../api/useCalendarEvents";
import CalendarEventDetail from "../components/CalendarEventDetail.vue";

const CALENDAR_PLUGINS = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  rrulePlugin,
  interactionPlugin,
];

const { isLoading, fullCalendarEvents, query } = useCalendarEvents();

const createEventModal = ref<InstanceType<typeof CreateEvent> | null>(null);

const selectedEvent = ref<CalendarEvent | null>(null);
const detailOpen = ref(false);

const formatWeekday = (date: Date): string =>
  date.toLocaleString("en-GB", { weekday: "short" }).slice(0, 2).toUpperCase();

const onEventClick = (props: EventClickArg) => {
  selectedEvent.value = props.event.extendedProps
    .calendarEvent as CalendarEvent;
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
  const event = props.event.extendedProps.calendarEvent as
    | CalendarEvent
    | undefined;

  // The drag-to-create preview has no event yet, so just show an empty div
  if (!event) return { domNodes: [] };

  const titleElement = document.createElement("div");
  titleElement.className = "calendar-event__title";
  titleElement.textContent = event.title;

  if (props.view.type === "dayGridMonth") return { domNodes: [titleElement] };
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
};

const calendarOptions = computed<CalendarOptions>(() => ({
  ...calendarBaseOptions,
  events: fullCalendarEvents.value,
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
      class="calendar-shell relative isolate min-h-0 flex-1 rounded-lg bg-white p-4 shadow"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70"
      >
        <span class="text-sm text-gray-400">Loading…</span>
      </div>
      <FullCalendar :options="calendarOptions" />
    </div>

    <CreateEvent ref="createEventModal" :query="query" />

    <CalendarEventDetail
      v-model="detailOpen"
      :event="selectedEvent"
      :query="query"
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
