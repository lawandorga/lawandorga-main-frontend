import type {
  CalendarEvent,
  OccurrenceOverride,
} from "../api/useCalendarEvents";

export interface ResolvedOccurrence {
  originalStart: string;
  start: string;
  end: string | null;
  title: string;
  description: string;
  location: string;
}

const toMilliseconds = (value: string): number => new Date(value).getTime();

export const isRecurring = (event: CalendarEvent): boolean =>
  event.recurrence_rule !== "";

export const seriesTimesShiftedByOccurrenceMove = (params: {
  originalStart: string;
  seriesStart: string;
  newStart: string;
  newEnd: string | null;
}): { start: string; end: string | null } => {
  const deltaMilliseconds =
    toMilliseconds(params.newStart) - toMilliseconds(params.originalStart);
  const start = new Date(
    toMilliseconds(params.seriesStart) + deltaMilliseconds,
  );
  const end =
    params.newEnd === null
      ? null
      : new Date(
          start.getTime() +
            (toMilliseconds(params.newEnd) - toMilliseconds(params.newStart)),
        );
  return {
    start: start.toISOString(),
    end: end === null ? null : end.toISOString(),
  };
};

export const resolveOccurrence = (
  event: CalendarEvent,
  originalStart: string,
  override?: OccurrenceOverride,
): ResolvedOccurrence => {
  const start = override?.start_time ?? originalStart;
  let end = override?.end_time ?? null;
  if (end === null && event.end_time !== null) {
    const durationMilliseconds =
      toMilliseconds(event.end_time) - toMilliseconds(event.start_time);
    end = new Date(toMilliseconds(start) + durationMilliseconds).toISOString();
  }
  return {
    originalStart,
    start,
    end,
    title: override?.title ?? event.title,
    description: override?.description ?? event.description,
    location: override?.location ?? event.location,
  };
};

export const findOverride = (
  event: CalendarEvent,
  originalStart: string,
): OccurrenceOverride | undefined =>
  event.overrides.find(
    (override) =>
      toMilliseconds(override.original_start) === toMilliseconds(originalStart),
  );
