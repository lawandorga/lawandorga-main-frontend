import type { RouteLocationNormalized } from "vue-router";

import { landingScrollBehavior } from "../utils/scroll";

const route = (standalone: boolean, hash = "") =>
  ({
    meta: standalone ? { standalone: true } : {},
    hash,
  }) as unknown as RouteLocationNormalized;

describe("landingScrollBehavior", () => {
  it("starts at the top when opening 'Alle Neuigkeiten' from the start page", () => {
    expect(landingScrollBehavior(route(true), route(true), null)).toEqual({
      top: 0,
    });
  });

  it("starts at the top when leaving a public page for the app", () => {
    expect(landingScrollBehavior(route(false), route(true), null)).toEqual({
      top: 0,
    });
  });

  it("restores the position on back and forward", () => {
    const saved = { left: 0, top: 4200 };
    expect(landingScrollBehavior(route(true), route(false), saved)).toBe(saved);
  });

  it("scrolls to the section of a hash link", () => {
    expect(
      landingScrollBehavior(route(true, "#neuigkeiten"), route(true), null),
    ).toEqual({ el: "#neuigkeiten" });
  });

  it("keeps the previous behaviour inside the app", () => {
    expect(landingScrollBehavior(route(false), route(false), null)).toBe(false);
  });
});
