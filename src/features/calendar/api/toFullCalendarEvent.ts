import type { EventInput } from "@fullcalendar/core";

import {
  EVENT_TYPE_META,
  RECURRENCE_FREQUENCIES,
  TYPE_TINT_ALPHA,
} from "../constants";
import type { CalendarEvent } from "./useCalendarEvents";

const MILLISECONDS_PER_MINUTE = 60000;

const getEventTypeColor = (eventType: CalendarEvent["event_type"]): string =>
  EVENT_TYPE_META[eventType].color;

const getFullCalendarFrequency = (rule: string): string | undefined =>
  RECURRENCE_FREQUENCIES.find((frequency) => frequency.rule === rule)
    ?.fullCalendarFreq;

const getEventDuration = (event: CalendarEvent): { minutes: number } | null => {
  if (event.is_all_day || !event.end_time) return null;
  const durationMs =
    new Date(event.end_time).getTime() - new Date(event.start_time).getTime();
  if (durationMs <= 0) return null;
  return { minutes: Math.round(durationMs / MILLISECONDS_PER_MINUTE) };
};

export const toFullCalendarEvent = (event: CalendarEvent): EventInput => {
  const color = getEventTypeColor(event.event_type);
  const baseEvent = {
    id: event.uuid,
    title: event.title,
    allDay: event.is_all_day,
    backgroundColor: `${color}${TYPE_TINT_ALPHA}`,
    borderColor: color, // TODO: calendar source color in the future
    textColor: color,
    extendedProps: { calendarEvent: event },
  };

  const frequency = getFullCalendarFrequency(event.recurrence_rule);
  if (frequency) {
    const duration = getEventDuration(event);
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
    end: event.end_time ?? undefined,
  };
};
