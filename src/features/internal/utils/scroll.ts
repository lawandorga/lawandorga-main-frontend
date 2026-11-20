import type { RouteLocationNormalized, RouterScrollBehavior } from "vue-router";

import { STICKY_HEADER_OFFSET } from "./landing";

/**
 * Scroll behaviour for the public landing pages (routes with
 * meta.standalone, they scroll the window).
 *
 * - back/forward: restore the previous position
 * - a link with a hash (e.g. #traeger, also in-page anchors, which the
 *   router handles as navigations): scroll to that section, below the
 *   sticky header (the router does not apply the page's scroll padding)
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
  if (to.hash) return { el: to.hash, top: STICKY_HEADER_OFFSET };
  return { top: 0 };
};
