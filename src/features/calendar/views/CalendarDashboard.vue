<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import type {
  CalendarOptions,
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import enGBLocale from "@fullcalendar/core/locales/en-gb";
import { computed, ref } from "vue";
import { ModalFree } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import {
  useCalendarEvents,
  type CalendarEvent,
} from "../api/useCalendarEvents";

const CALENDAR_PLUGINS = [dayGridPlugin, timeGridPlugin, listPlugin];

const { calendarEvents } = useCalendarEvents();

const selectedEvent = ref<CalendarEvent | null>(null);
const detailOpen = ref(false);
const isCalendarLoading = computed(() => calendarEvents.value === undefined);

const EVENT_TYPE_META = {
  APPOINTMENT: { label: "Appointment", color: "#2563eb" },
  TASK: { label: "Task", color: "#16a34a" },
  MEETING: { label: "Meeting", color: "#7c3aed" },
  DEADLINE: { label: "Deadline", color: "#dc2626" },
  EXTERNAL: { label: "External", color: "#d97706" },
} as const;

const TINT_ALPHA = "20"; // 12.5% opacity

const getEventTypeMeta = (eventType: CalendarEvent["event_type"]) =>
  EVENT_TYPE_META[eventType];

const eventTypeColor = (eventType: CalendarEvent["event_type"]): string =>
  getEventTypeMeta(eventType).color;

const formatEventType = (eventType: CalendarEvent["event_type"]): string =>
  getEventTypeMeta(eventType).label;

const formatTime = (value: string): string =>
  new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTimeRange = (event: CalendarEvent): string => {
  const startTime = formatTime(event.start_time);
  if (!event.end_time) return startTime;
  return `${startTime} - ${formatTime(event.end_time)}`;
};

const formatWeekday = (date: Date): string =>
  date.toLocaleString("en-GB", { weekday: "short" }).slice(0, 2).toUpperCase();

const fullCalendarEvents = computed(() => {
  return (calendarEvents.value ?? []).map((event) => {
    const color = eventTypeColor(event.event_type);
    return {
      id: event.uuid,
      title: event.title,
      start: event.start_time,
      end: event.end_time ?? undefined,
      backgroundColor: `${color}${TINT_ALPHA}`,
      borderColor: color, // TODO: calendar source color in the future
      textColor: color,
      extendedProps: { calendarEvent: event },
    };
  });
});

const onEventClick = (props: EventClickArg) => {
  selectedEvent.value = props.event.extendedProps
    .calendarEvent as CalendarEvent;
  detailOpen.value = true;
};

const selectedEventColor = computed(() =>
  eventTypeColor(selectedEvent.value!.event_type),
);

const formattedEventDate = computed(() =>
  new Date(selectedEvent.value!.start_time).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

const formattedEventTime = computed(() =>
  formatTimeRange(selectedEvent.value!),
);

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
  weekdayElement.className = "calendar-day-header__abbr";
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

const monthViewEventContent = (titleElement: HTMLDivElement) => ({
  domNodes: [titleElement],
});

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
  const event = props.event.extendedProps.calendarEvent as CalendarEvent;

  const titleElement = document.createElement("div");
  titleElement.className = "calendar-event__title";
  titleElement.textContent = event.title;

  if (props.view.type === "dayGridMonth")
    return monthViewEventContent(titleElement);
  if (props.view.type === "listMonth")
    return listViewEventContent(event, titleElement);
  return gridViewEventContent(event, titleElement);
};

const calendarBaseOptions: CalendarOptions = {
  plugins: CALENDAR_PLUGINS,
  initialView: "timeGridWeek",
  headerToolbar: {
    left: "prev today next title",
    center: "",
    right: "timeGridWeek,dayGridMonth,listMonth,timeGridDay",
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
    dayGridMonth: {},
  },
  locale: enGBLocale,
  firstDay: 1,
  // nav h-16 (64) + main py-6×2 (48) + breadcrumbs h-11 (44) + gap space-y-6 (24) + card p-4×2 (32) = 212px
  height: "calc(100vh - 212px)",
  nowIndicator: true,
  eventDisplay: "block",
  editable: false,
  allDaySlot: false,
  scrollTime: "07:00:00",
  slotLabelFormat: { hour: "numeric", minute: "2-digit", hour12: false },
  dayHeaderContent,
  eventContent,
  eventClick: onEventClick,
};

const calendarOptions = computed<CalendarOptions>(() => ({
  ...calendarBaseOptions,
  events: fullCalendarEvents.value,
}));
</script>

<template>
  <div class="calendar-page mx-auto space-y-6 max-w-(--breakpoint-2xl)">
    <BreadcrumbsBar :base="{ name: 'calendar-dashboard' }" :pages="[]">
      <CalendarDaysIcon class="w-6 h-6" />
    </BreadcrumbsBar>

    <div class="relative p-4 bg-white rounded-lg shadow isolate calendar-shell">
      <div
        v-if="isCalendarLoading"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70"
      >
        <span class="text-sm text-gray-400">Loading…</span>
      </div>
      <FullCalendar :options="calendarOptions" />
    </div>

    <ModalFree
      v-model="detailOpen"
      :title="selectedEvent?.title ?? ''"
      width="max-w-lg"
    >
      <template v-if="selectedEvent">
        <div class="flex flex-wrap gap-2 mb-5">
          <span
            class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            :style="{
              backgroundColor: `${selectedEventColor}${TINT_ALPHA}`,
              color: selectedEventColor,
            }"
          >
            <span
              class="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              :style="{
                backgroundColor: selectedEventColor,
              }"
            />
            {{ formatEventType(selectedEvent.event_type) }}
          </span>
          <span
            v-if="selectedEvent.guest_user_ids.length > 0"
            class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-600"
          >
            Shared
          </span>
        </div>

        <dl class="space-y-3 text-sm">
          <div class="flex items-start gap-3">
            <dt class="shrink-0">
              <CalendarDaysIcon
                class="w-4 h-4 text-gray-400 mt-0.5"
                aria-hidden="true"
              />
              <span class="sr-only">Date</span>
            </dt>
            <div>
              <dd class="text-gray-900">{{ formattedEventDate }}</dd>
              <dd class="text-gray-500">{{ formattedEventTime }}</dd>
            </div>
          </div>
          <div v-if="selectedEvent.location" class="flex items-center gap-3">
            <dt class="shrink-0">
              <MapPinIcon class="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span class="sr-only">Location</span>
            </dt>
            <dd class="text-gray-900">{{ selectedEvent.location }}</dd>
          </div>
          <div v-if="selectedEvent.description" class="flex items-start gap-3">
            <dt class="shrink-0">
              <DocumentTextIcon
                class="w-4 h-4 text-gray-400 mt-0.5"
                aria-hidden="true"
              />
              <span class="sr-only">Description</span>
            </dt>
            <dd class="text-gray-900 whitespace-pre-wrap">
              {{ selectedEvent.description }}
            </dd>
          </div>
          <div class="flex items-center gap-3">
            <dt class="shrink-0">
              <UserIcon class="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span class="sr-only">Creator</span>
            </dt>
            <dd class="text-gray-900">{{ selectedEvent.creator_name }}</dd>
          </div>
        </dl>

        <div class="flex gap-3 pt-4 mt-6 border-t border-gray-100">
          <button
            type="button"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="detailOpen = false"
          >
            Close
          </button>
          <button
            type="button"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-formcolor rounded-lg hover:bg-(--color-formcolor-hover)"
          >
            Edit
          </button>
        </div>
      </template>
    </ModalFree>
  </div>
</template>

<style scoped>
.calendar-page {
  --color-formcolor-hover: #005068;
}

.calendar-shell {
  min-height: calc(100vh - 212px);
  --fc-today-bg-color: rgba(0, 60, 77, 0.07);
  --fc-neutral-bg-color: #f7f7f4;
  --fc-list-event-hover-bg-color: white;
}

:deep(.calendar-day-header) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
}

:deep(.calendar-day-header__abbr) {
  font-size: 10px;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

:deep(.calendar-day-header__date) {
  font-size: 17px;
  font-weight: 300;
  color: var(--color-formcolor);
  line-height: 1;
}

:deep(.calendar-day-header__date--today) {
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

:deep(.fc .fc-button-primary) {
  background-color: var(--fc-neutral-bg-color);
  border-color: #e2e2de;
  color: #374151;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 6px;
}

:deep(.fc .fc-button-primary:not(:disabled):hover) {
  background-color: #e2e2de;
  border-color: #e2e2de;
  color: #374151;
  box-shadow: none;
}

:deep(.fc-day-sat),
:deep(.fc-day-sun) {
  background-color: #fafaf8;
}

/* Slot time labels: small, muted */
:deep(.fc-timegrid-slot-label-cushion) {
  font-size: 10px;
  color: #9ca3af;
  padding-right: 6px;
}

/* Month view: weekday-only column headers */
:deep(.calendar-month-header__weekday) {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 0.05em;
  padding: 6px 0;
}

/* Month view: left-align day numbers */
:deep(.fc-daygrid-day-top) {
  flex-direction: row;
}

:deep(.fc-daygrid-day-number) {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-formcolor);
  padding: 4px 8px;
}

/* Month view: today's day number circle */
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

/* Month view: out-of-month days */
:deep(.fc-day-other) {
  background-color: #fafaf8;
}

:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #d1d5db;
}

/* Month view: compact event sizing */
:deep(.fc-daygrid-event) {
  font-size: 11px;
  padding: 1px 2px;
}

/* Event cards: light tint background with left accent border */
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

/* Active view button gets the brand colour */
:deep(.fc .fc-button-primary.fc-button-active) {
  background-color: var(--color-formcolor);
  border-color: var(--color-formcolor);
  color: #fff;
  font-weight: 500;
}

:deep(.fc .fc-button-primary.fc-button-active:not(:disabled):hover) {
  background-color: var(--color-formcolor-hover);
  border-color: var(--color-formcolor-hover);
  color: #fff;
  box-shadow: none;
}
</style>
