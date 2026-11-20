import type { RouteLocationNormalized } from "vue-router";

import { landingScrollBehavior, markLandingReady } from "../utils/scroll";

const route = (standalone: boolean, hash = "", name?: string) =>
  ({
    meta: standalone ? { standalone: true } : {},
    hash,
    name,
  }) as unknown as RouteLocationNormalized;

describe("landingScrollBehavior on a fresh load of /start/#…", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("waits until the start page content is rendered", async () => {
    document.body.innerHTML =
      '<section id="roadmap"><div data-anchor><h2>Roadmap</h2></div></section>';
    const result = landingScrollBehavior(
      route(true, "#roadmap", "start"),
      route(false),
      null,
    );

    expect(result).toBeInstanceOf(Promise);
    markLandingReady();
    await expect(result).resolves.toEqual({
      el: document.querySelector("[data-anchor]"),
      top: 112,
    });
  });

  it("scrolls right away once the content is there", () => {
    document.body.innerHTML = '<section id="roadmap"></section>';

    expect(
      landingScrollBehavior(
        route(true, "#roadmap", "start"),
        route(true),
        null,
      ),
    ).toEqual({ el: document.getElementById("roadmap"), top: 112 });
  });
});

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

  describe("hash links", () => {
    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("scrolls to the heading row of the section, below the header", () => {
      document.body.innerHTML =
        '<section id="neuigkeiten"><div><div data-anchor><h2>Neuigkeiten</h2></div></div></section>';
      const heading = document.querySelector("[data-anchor]");

      expect(
        landingScrollBehavior(route(true, "#neuigkeiten"), route(true), null),
      ).toEqual({ el: heading, top: 112 });
    });

    it("falls back to the element with the id", () => {
      document.body.innerHTML = '<section id="traeger"></section>';
      const section = document.getElementById("traeger");

      expect(
        landingScrollBehavior(route(true, "#traeger"), route(true), null),
      ).toEqual({ el: section, top: 112 });
    });

    it("passes unknown hashes to the router", () => {
      expect(
        landingScrollBehavior(route(true, "#unknown"), route(true), null),
      ).toEqual({ el: "#unknown", top: 112 });
    });
  });

  it("keeps the previous behaviour inside the app", () => {
    expect(landingScrollBehavior(route(false), route(false), null)).toBe(false);
  });
});
