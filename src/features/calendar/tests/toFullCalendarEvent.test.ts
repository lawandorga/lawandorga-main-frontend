import { describe, expect, it } from "vitest";

import { occurrenceToFullCalendarEvent } from "../api/toFullCalendarEvent";
import type {
  CalendarEvent,
  CalendarOccurrence,
} from "../api/useCalendarEvents";

const makeOccurrence = (
  overrides: Partial<CalendarOccurrence> = {},
): CalendarOccurrence => ({
  event_uuid: "event-1",
  original_start: "2026-03-22T09:00:00+00:00",
  title: "Hearing",
  start_time: "2026-03-22T09:00:00+00:00",
  end_time: "2026-03-22T10:30:00+00:00",
  is_all_day: false,
  event_type: "APPOINTMENT",
  ...overrides,
});

const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  uuid: "event-1",
  creator_id: 7,
  creator_name: "Ada",
  title: "Hearing",
  description: "",
  event_type: "APPOINTMENT",
  start_time: "2026-03-22T09:00:00+00:00",
  end_time: "2026-03-22T10:30:00+00:00",
  is_all_day: false,
  location: "",
  recurrence_rule: "",
  recurrence_until: null,
  view_grant_targets: [],
  edit_grant_targets: [],
  guest_user_ids: [],
  guest_user_names: [],
  own_reminders: [],
  overrides: [],
  created: "2026-03-01T00:00:00+00:00",
  updated: "2026-03-01T00:00:00+00:00",
  ...overrides,
});

describe("occurrenceToFullCalendarEvent", () => {
  it("maps an occurrence to a standalone event carrying its parent and slot", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence(),
      makeEvent(),
      7,
    );

    expect(result.id).toBe("event-1:2026-03-22T09:00:00+00:00");
    expect(result.title).toBe("Hearing");
    expect(result.start).toBe("2026-03-22T09:00:00+00:00");
    expect(result.end).toBe("2026-03-22T10:30:00+00:00");
    expect(result.allDay).toBe(false);
    expect(result.extendedProps).toMatchObject({
      eventUuid: "event-1",
      originalStart: "2026-03-22T09:00:00+00:00",
    });
  });

  it("makes a non-recurring occurrence owned by the current user draggable", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence(),
      makeEvent({ creator_id: 7 }),
      7,
    );

    expect(result.editable).toBe(true);
  });

  it("makes a recurring occurrence draggable for the owner", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence(),
      makeEvent({ creator_id: 7, recurrence_rule: "FREQ=WEEKLY" }),
      7,
    );

    expect(result.editable).toBe(true);
  });

  it("keeps another user's occurrence non-draggable", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence(),
      makeEvent({ creator_id: 7 }),
      99,
    );

    expect(result.editable).toBe(false);
  });

  it("is non-draggable when the parent event is not loaded", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence(),
      undefined,
      7,
    );

    expect(result.editable).toBe(false);
  });

  it("extends an all-day occurrence's end to the exclusive next day", () => {
    const result = occurrenceToFullCalendarEvent(
      makeOccurrence({
        is_all_day: true,
        start_time: "2026-03-16T00:00:00",
        end_time: "2026-03-18T00:00:00", // inclusive last day
      }),
      makeEvent({ is_all_day: true }),
      7,
    );

    expect(result.allDay).toBe(true);
    // inclusive 18th -> exclusive 19th
    expect(result.end).toBe(new Date("2026-03-19T00:00:00").toISOString());
  });
});
