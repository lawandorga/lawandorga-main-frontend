import { onBeforeUnmount, onMounted } from "vue";

import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  STICKY_HEADER_OFFSET,
} from "@/features/internal/utils/landing";

export const STICKY_HEADER_SCROLL_PADDING = `${STICKY_HEADER_OFFSET}px`;

/**
 * Sets the document title, the page language (de), the meta description and
 * a scroll padding for the sticky header of the public landing pages and
 * restores the previous values when the page is left. The scroll padding
 * keeps anchor targets and focused elements below the header (WCAG 2.4.11).
 */
export function useLandingMeta(title = PAGE_TITLE) {
  let previousTitle = "";
  let previousLang = "";
  let previousScrollPadding = "";
  let previousDescription: string | null = null;
  let createdMeta = false;

  onMounted(() => {
    previousTitle = document.title;
    document.title = title;
    previousLang = document.documentElement.lang;
    document.documentElement.lang = "de";
    previousScrollPadding = document.documentElement.style.scrollPaddingTop;
    document.documentElement.style.scrollPaddingTop =
      STICKY_HEADER_SCROLL_PADDING;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
      createdMeta = true;
    }
    previousDescription = meta.getAttribute("content");
    meta.setAttribute("content", PAGE_DESCRIPTION);
  });

  onBeforeUnmount(() => {
    document.title = previousTitle;
    document.documentElement.lang = previousLang;
    document.documentElement.style.scrollPaddingTop = previousScrollPadding;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) return;
    if (createdMeta) meta.remove();
    else if (previousDescription !== null)
      meta.setAttribute("content", previousDescription);
  });
}
