import { describe, expect, it } from "vitest";

import { toFullCalendarEvent } from "../api/toFullCalendarEvent";
import type { CalendarEvent } from "../api/useCalendarEvents";

const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  uuid: "event-1",
  creator_id: 1,
  creator_name: "Ada",
  title: "Hearing",
  description: "",
  event_type: "APPOINTMENT",
  start_time: "2026-03-15T10:00:00+01:00",
  end_time: "2026-03-15T11:30:00+01:00",
  is_all_day: false,
  location: "",
  recurrence_rule: "",
  recurrence_until: null,
  guest_user_ids: [],
  guest_user_names: [],
  created: "2026-03-01T00:00:00+01:00",
  updated: "2026-03-01T00:00:00+01:00",
  ...overrides,
});

describe("toFullCalendarEvent", () => {
  it("maps a one-off event to start/end without an rrule", () => {
    const result = toFullCalendarEvent(makeEvent());

    expect(result).toMatchObject({
      start: "2026-03-15T10:00:00+01:00",
      end: "2026-03-15T11:30:00+01:00",
    });
    expect(result).not.toHaveProperty("rrule");
    expect(result).not.toHaveProperty("duration");
  });

  it("translates a recurrence rule into the matching rrule frequency", () => {
    const result = toFullCalendarEvent(
      makeEvent({ recurrence_rule: "FREQ=WEEKLY" }),
    );

    expect(result).toHaveProperty("rrule.freq", "weekly");
    expect(result).toHaveProperty("rrule.dtstart", "2026-03-15T10:00:00+01:00");
    expect(result).not.toHaveProperty("start");
  });

  it("includes the until date only when one is set", () => {
    const withUntil = toFullCalendarEvent(
      makeEvent({
        recurrence_rule: "FREQ=DAILY",
        recurrence_until: "2026-06-01",
      }),
    );
    const withoutUntil = toFullCalendarEvent(
      makeEvent({ recurrence_rule: "FREQ=DAILY", recurrence_until: null }),
    );

    expect(withUntil).toHaveProperty(
      "rrule.until",
      "2026-06-01T10:00:00+01:00",
    );
    expect(withoutUntil).not.toHaveProperty("rrule.until");
  });

  it("derives the occurrence duration in minutes for recurring timed events", () => {
    const result = toFullCalendarEvent(
      makeEvent({ recurrence_rule: "FREQ=WEEKLY" }),
    );

    expect(result).toHaveProperty("duration", { minutes: 90 });
  });

  it("omits duration for single-day all-day recurring events", () => {
    const result = toFullCalendarEvent(
      makeEvent({ recurrence_rule: "FREQ=WEEKLY", is_all_day: true }),
    );

    expect(result).toHaveProperty("rrule.freq", "weekly");
    expect(result).not.toHaveProperty("duration");
  });

  it("spans the inclusive day count for multi-day all-day recurring events", () => {
    const result = toFullCalendarEvent(
      makeEvent({
        recurrence_rule: "FREQ=WEEKLY",
        is_all_day: true,
        start_time: "2026-03-16T00:00:00",
        end_time: "2026-03-18T00:00:00", // inclusive 16th–18th = 3 days
      }),
    );

    expect(result).toHaveProperty("duration", { days: 3 });
  });

  it("extends an all-day event's end to the exclusive next day", () => {
    const result = toFullCalendarEvent(
      makeEvent({
        is_all_day: true,
        start_time: "2026-03-16T00:00:00",
        end_time: "2026-03-18T00:00:00",
      }),
    );

    expect(result.start).toBe("2026-03-16T00:00:00");
    // inclusive 18th → exclusive 19th (one calendar day later)
    expect(result.end).toBe(new Date("2026-03-19T00:00:00").toISOString());
  });

  it("leaves an all-day event without an end as a single day", () => {
    const result = toFullCalendarEvent(
      makeEvent({ is_all_day: true, end_time: null }),
    );

    expect(result.end).toBeUndefined();
    expect(result.allDay).toBe(true);
  });

  it("treats an unknown recurrence rule as a one-off event", () => {
    const result = toFullCalendarEvent(
      makeEvent({ recurrence_rule: "FREQ=HOURLY" }),
    );

    expect(result).not.toHaveProperty("rrule");
    expect(result).toHaveProperty("start", "2026-03-15T10:00:00+01:00");
  });
});
