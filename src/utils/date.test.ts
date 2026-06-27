import { describe, expect, it } from "vitest";

import { dateWithTimeOf } from "./date";

describe("dateWithTimeOf", () => {
  it("combines a date with the time-of-day and zone of a datetime", () => {
    expect(dateWithTimeOf("2026-06-27", "2026-06-22T06:30:00Z")).toBe(
      "2026-06-27T06:30:00Z",
    );
  });

  it("preserves a numeric timezone offset", () => {
    expect(dateWithTimeOf("2026-06-27", "2026-06-22T08:30:00+02:00")).toBe(
      "2026-06-27T08:30:00+02:00",
    );
  });

  it("returns the date unchanged when the datetime carries no time", () => {
    expect(dateWithTimeOf("2026-06-27", "2026-06-22")).toBe("2026-06-27");
  });
});
