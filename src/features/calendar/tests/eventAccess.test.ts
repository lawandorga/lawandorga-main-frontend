import { describe, expect, it } from "vitest";

import { getEventAccessKind } from "../utils/eventAccess";

describe("getEventAccessKind", () => {
  it("returns ORGANIZATION when an org target is present", () => {
    const source = getEventAccessKind({
      view_grant_targets: ["user:11", "org:3"],
      edit_grant_targets: [],
    });

    expect(source).toBe("ORGANIZATION");
  });

  it("returns SHARED when user or group targets are present", () => {
    const source = getEventAccessKind({
      view_grant_targets: ["group:7"],
      edit_grant_targets: ["user:42"],
    });

    expect(source).toBe("SHARED");
  });

  it("returns PERSONAL when no grant targets are present", () => {
    const source = getEventAccessKind({
      view_grant_targets: [],
      edit_grant_targets: [],
    });

    expect(source).toBe("PERSONAL");
  });
});
