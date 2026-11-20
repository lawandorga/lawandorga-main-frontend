import type { RouteLocationNormalized, RouterScrollBehavior } from "vue-router";

import { SECTION_ANCHOR_OFFSET } from "./landing";

const LANDING_READY_EVENT = "landing:ready";
let landingReady = false;

/**
 * Called by the start page once its data is rendered. Anchor jumps wait for
 * it, because the showroom and the roadmap change the height of the page.
 * The data is kept between visits, so later visits are ready right away.
 */
export function markLandingReady() {
  landingReady = true;
  window.dispatchEvent(new Event(LANDING_READY_EVENT));
}

function whenLandingReady(timeout = 1500): Promise<void> {
  if (landingReady) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener(LANDING_READY_EVENT, done);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(done, timeout);
    window.addEventListener(LANDING_READY_EVENT, done);
  });
}

/**
 * The element an anchor link scrolls to: the heading row of the section
 * (marked with data-anchor), not the section itself. Sections have a large
 * top padding, so their heading would otherwise end up far below the sticky
 * header. Falls back to the element with the id.
 */
export function getAnchorTarget(hash: string): Element | null {
  let section: Element | null = null;
  try {
    section = document.querySelector(hash);
  } catch {
    return null;
  }
  if (!section) return null;
  return section.querySelector("[data-anchor]") ?? section;
}

function anchorPosition(hash: string) {
  const target = getAnchorTarget(hash);
  return { el: target ?? hash, top: SECTION_ANCHOR_OFFSET };
}

/**
 * Scroll behaviour for the public landing pages (routes with
 * meta.standalone, they scroll the window).
 *
 * - back/forward: restore the previous position
 * - a link with a hash (menu entries and other in-page anchors, which the
 *   router handles as navigations, and links like /start/#roadmap from
 *   other pages): the heading of the section ends up the same distance below
 *   the sticky header for every section
 * - any other navigation from or to a public page: start at the top
 * - everything else (the app itself) keeps the previous behaviour: no scroll
 */
export const landingScrollBehavior: RouterScrollBehavior = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  savedPosition,
) => {
  const involvesPublicPage =
    to.meta.standalone === true || from.meta.standalone === true;
  if (!involvesPublicPage) return false;
  if (savedPosition) return savedPosition;
  if (to.hash) {
    if (to.name === "start" && !landingReady) {
      return whenLandingReady().then(() => anchorPosition(to.hash));
    }
    return anchorPosition(to.hash);
  }
  return { top: 0 };
};
