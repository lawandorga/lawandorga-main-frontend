import type { EventInput } from "@fullcalendar/core";

import { addDays } from "@/utils/date";

import { EVENT_TYPE_META, TYPE_TINT_ALPHA } from "../constants";
import type { CalendarEvent, CalendarOccurrence } from "./useCalendarEvents";

// FullCalendar's all-day end is exclusive, the ranges from the backend inclusive
const toExclusiveAllDayEnd = (endTime: string): string =>
  addDays(new Date(endTime), 1).toISOString();

export const occurrenceToFullCalendarEvent = (
  occurrence: CalendarOccurrence,
  parentEvent: CalendarEvent | undefined,
  currentUserId: number | undefined,
): EventInput => {
  const color = EVENT_TYPE_META[occurrence.event_type].color;
  const isEditable =
    parentEvent !== undefined && parentEvent.creator_id === currentUserId;

  return {
    id: `${occurrence.event_uuid}:${occurrence.original_start}`,
    title: occurrence.title,
    start: occurrence.start_time,
    end: occurrence.is_all_day
      ? toExclusiveAllDayEnd(occurrence.end_time)
      : occurrence.end_time,
    allDay: occurrence.is_all_day,
    editable: isEditable,
    backgroundColor: `${color}${TYPE_TINT_ALPHA}`,
    borderColor: color,
    textColor: color,
    extendedProps: {
      eventUuid: occurrence.event_uuid,
      originalStart: occurrence.original_start,
    },
  };
};
