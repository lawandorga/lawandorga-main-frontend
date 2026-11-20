import type { RouteLocationNormalized, RouterScrollBehavior } from "vue-router";

/**
 * Scroll behaviour for the public landing pages (routes with
 * meta.standalone, they scroll the window).
 *
 * - back/forward: restore the previous position
 * - a link with a hash (e.g. /start/#neuigkeiten): scroll to that section
 *   (the sticky header is covered by the scroll padding of the page)
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
  if (to.hash) return { el: to.hash };
  return { top: 0 };
};
