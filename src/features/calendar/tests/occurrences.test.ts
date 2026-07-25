import { describe, expect, it } from "vitest";

import type {
  CalendarEvent,
  OccurrenceOverride,
} from "../api/useCalendarEvents";
import {
  findOverride,
  resolveOccurrence,
  seriesTimesShiftedByOccurrenceMove,
} from "../utils/occurrences";

const makeEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  uuid: "event-1",
  creator_id: 1,
  creator_name: "Ada",
  title: "Hearing",
  description: "Series description",
  event_type: "APPOINTMENT",
  start_time: "2026-03-15T10:00:00+01:00",
  end_time: "2026-03-15T11:30:00+01:00",
  is_all_day: false,
  location: "Room 1",
  recurrence_rule: "FREQ=WEEKLY",
  recurrence_until: null,
  view_grant_targets: [],
  edit_grant_targets: [],
  guest_user_ids: [],
  guest_user_names: [],
  own_reminders: [],
  overrides: [],
  created: "2026-03-01T00:00:00+01:00",
  updated: "2026-03-01T00:00:00+01:00",
  ...overrides,
});

const makeOverride = (
  overrides: Partial<OccurrenceOverride> = {},
): OccurrenceOverride => ({
  uuid: "override-1",
  original_start: "2026-03-22T10:00:00+01:00",
  cancelled: false,
  start_time: null,
  end_time: null,
  title: null,
  description: null,
  location: null,
  ...overrides,
});

describe("findOverride", () => {
  it("matches by instant across different timezone representations", () => {
    const override = makeOverride();
    const event = makeEvent({ overrides: [override] });

    expect(findOverride(event, "2026-03-22T09:00:00.000Z")).toBe(override);
  });

  it("returns undefined for a slot without an override", () => {
    const event = makeEvent({ overrides: [makeOverride()] });

    expect(findOverride(event, "2026-03-29T10:00:00+02:00")).toBeUndefined();
  });
});

describe("resolveOccurrence", () => {
  it("inherits every null field from the series", () => {
    const event = makeEvent();
    const blankOverride = makeOverride();
    const resolved = resolveOccurrence(event, blankOverride);

    expect(resolved.title).toBe("Hearing");
    expect(resolved.description).toBe("Series description");
    expect(resolved.location).toBe("Room 1");
    expect(resolved.start).toBe("2026-03-22T10:00:00+01:00");
    const expectedEnd = new Date(
      new Date("2026-03-22T10:00:00+01:00").getTime() + 90 * 60000,
    ).toISOString();
    expect(resolved.end).toBe(expectedEnd);
  });

  it("uses overridden fields and keeps the duration for a moved start", () => {
    const event = makeEvent();
    const resolved = resolveOccurrence(
      event,
      makeOverride({
        start_time: "2026-03-23T15:00:00+01:00",
        title: "Hearing (moved)",
        location: "Room 2",
      }),
    );

    expect(resolved.title).toBe("Hearing (moved)");
    expect(resolved.location).toBe("Room 2");
    expect(resolved.start).toBe("2026-03-23T15:00:00+01:00");
    const expectedEnd = new Date(
      new Date("2026-03-23T15:00:00+01:00").getTime() + 90 * 60000,
    ).toISOString();
    expect(resolved.end).toBe(expectedEnd);
  });

  it("uses an overridden end as-is", () => {
    const event = makeEvent();
    const resolved = resolveOccurrence(
      event,
      makeOverride({ end_time: "2026-03-22T13:00:00+01:00" }),
    );

    expect(resolved.end).toBe("2026-03-22T13:00:00+01:00");
  });
});

describe("seriesTimesShiftedByOccurrenceMove", () => {
  it("shifts the series start by the occurrence's move delta, keeping duration", () => {
    // occurrence at the 2nd slot moved +1 day +2h; series should shift the same
    const result = seriesTimesShiftedByOccurrenceMove({
      originalStart: "2026-03-22T10:00:00+01:00",
      seriesStart: "2026-03-15T10:00:00+01:00",
      newStart: "2026-03-23T12:00:00+01:00",
      newEnd: "2026-03-23T13:00:00+01:00", // 1h duration, unchanged
    });

    expect(result.start).toBe(
      new Date("2026-03-16T12:00:00+01:00").toISOString(),
    );
    expect(result.end).toBe(
      new Date("2026-03-16T13:00:00+01:00").toISOString(),
    );
  });

  it("adopts a resized occurrence's new duration with no start delta", () => {
    // start unchanged, end extended by 1h -> whole series becomes 2h long
    const result = seriesTimesShiftedByOccurrenceMove({
      originalStart: "2026-03-22T10:00:00+01:00",
      seriesStart: "2026-03-15T10:00:00+01:00",
      newStart: "2026-03-22T10:00:00+01:00",
      newEnd: "2026-03-22T12:00:00+01:00",
    });

    expect(result.start).toBe(
      new Date("2026-03-15T10:00:00+01:00").toISOString(),
    );
    expect(result.end).toBe(
      new Date("2026-03-15T12:00:00+01:00").toISOString(),
    );
  });

  it("keeps a null end null", () => {
    const result = seriesTimesShiftedByOccurrenceMove({
      originalStart: "2026-03-22T10:00:00+01:00",
      seriesStart: "2026-03-15T10:00:00+01:00",
      newStart: "2026-03-23T10:00:00+01:00",
      newEnd: null,
    });

    expect(result.end).toBeNull();
  });
});
