import type { EventApi, EventInput } from "@fullcalendar/vue3";

import { addDays } from "@/utils/date";

import {
  EVENT_TYPE_META,
  TYPE_TINT_ALPHA,
  type EventSource,
} from "../constants";
import { getEventAccessKind } from "../utils/eventAccess";
import type { CalendarEvent, CalendarOccurrence } from "./useCalendarEvents";

export interface OccurrenceProps {
  eventUuid: string;
  originalStart: string;
}

interface OccurrenceExtendedProps extends OccurrenceProps {
  eventSource: EventSource | undefined;
}

export const readOccurrenceProps = (
  event: EventApi,
): OccurrenceProps | null => {
  const { eventUuid, originalStart } = event.extendedProps;
  if (typeof eventUuid !== "string" || typeof originalStart !== "string")
    return null;
  return { eventUuid, originalStart };
};

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
    color: `${color}${TYPE_TINT_ALPHA}`,
    contrastColor: color,
    extendedProps: {
      eventUuid: occurrence.event_uuid,
      originalStart: occurrence.original_start,
      eventSource: parentEvent ? getEventAccessKind(parentEvent) : undefined,
    } satisfies OccurrenceExtendedProps,
  };
};
