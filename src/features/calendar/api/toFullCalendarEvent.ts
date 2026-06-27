import type { EventInput } from "@fullcalendar/core";

import { addDays, dateWithTimeOf } from "@/utils/date";

import {
  EVENT_TYPE_META,
  RECURRENCE_FREQUENCIES,
  TYPE_TINT_ALPHA,
} from "../constants";
import type { CalendarEvent } from "./useCalendarEvents";

const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_DAY = 86400000;

const getEventTypeColor = (eventType: CalendarEvent["event_type"]): string =>
  EVENT_TYPE_META[eventType].color;

const getFullCalendarFrequency = (rule: string): string | undefined =>
  RECURRENCE_FREQUENCIES.find((frequency) => frequency.rule === rule)
    ?.fullCalendarFreq;

// FullCalendar's all-day end is exclusive, we want to store (and show) the last day included
const toExclusiveAllDayEnd = (endTime: string): string =>
  addDays(new Date(endTime), 1).toISOString();

const millisecondsBetween = (start: string, end: string): number =>
  new Date(end).getTime() - new Date(start).getTime();

const getAllDayDuration = (event: CalendarEvent): { days: number } | null => {
  if (!event.end_time) return null;
  const elapsedMilliseconds = millisecondsBetween(
    event.start_time,
    event.end_time,
  );
  // Rounding because of daylight savings time; +1 to include the last day
  const days = Math.round(elapsedMilliseconds / MILLISECONDS_PER_DAY) + 1;
  return days > 1 ? { days } : null;
};

const getTimedDuration = (event: CalendarEvent): { minutes: number } | null => {
  if (!event.end_time) return null;
  const elapsedMilliseconds = millisecondsBetween(
    event.start_time,
    event.end_time,
  );
  if (elapsedMilliseconds <= 0) return null;
  return { minutes: elapsedMilliseconds / MILLISECONDS_PER_MINUTE };
};

const buildAllDayEvent = (
  event: CalendarEvent,
  baseEvent: EventInput,
): EventInput => {
  const frequency = getFullCalendarFrequency(event.recurrence_rule);

  if (frequency) {
    const duration = getAllDayDuration(event);
    return {
      ...baseEvent,
      rrule: {
        freq: frequency,
        dtstart: event.start_time,
        ...(event.recurrence_until ? { until: event.recurrence_until } : {}),
      },
      ...(duration ? { duration } : {}),
    };
  }

  return {
    ...baseEvent,
    start: event.start_time,
    end: event.end_time ? toExclusiveAllDayEnd(event.end_time) : undefined,
  };
};

const buildTimedEvent = (
  event: CalendarEvent,
  baseEvent: EventInput,
): EventInput => {
  const frequency = getFullCalendarFrequency(event.recurrence_rule);

  if (frequency) {
    const duration = getTimedDuration(event);
    return {
      ...baseEvent,
      rrule: {
        freq: frequency,
        dtstart: event.start_time,
        ...(event.recurrence_until
          ? { until: dateWithTimeOf(event.recurrence_until, event.start_time) }
          : {}),
      },
      ...(duration ? { duration } : {}),
    };
  }

  return {
    ...baseEvent,
    start: event.start_time,
    end: event.end_time ?? undefined,
  };
};

export const toFullCalendarEvent = (
  event: CalendarEvent,
  currentUserId?: number,
): EventInput => {
  const color = getEventTypeColor(event.event_type);
  const isEditable =
    event.creator_id === currentUserId && event.recurrence_rule === "";
  const baseEvent: EventInput = {
    id: event.uuid,
    title: event.title,
    allDay: event.is_all_day,
    editable: isEditable,
    backgroundColor: `${color}${TYPE_TINT_ALPHA}`,
    borderColor: color, // TODO: calendar source color in the future
    textColor: color,
    extendedProps: { calendarEvent: event },
  };

  return event.is_all_day
    ? buildAllDayEvent(event, baseEvent)
    : buildTimedEvent(event, baseEvent);
};
