import { onBeforeUnmount, onMounted } from "vue";

import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from "@/features/internal/utils/landing";

/**
 * Sets the document title, the page language (de) and the meta description of
 * the public landing page and restores the previous values when the page is
 * left.
 */
export function useLandingMeta(title = PAGE_TITLE) {
  let previousTitle = "";
  let previousLang = "";
  let previousDescription: string | null = null;
  let createdMeta = false;

  onMounted(() => {
    previousTitle = document.title;
    document.title = title;
    previousLang = document.documentElement.lang;
    document.documentElement.lang = "de";

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
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) return;
    if (createdMeta) meta.remove();
    else if (previousDescription !== null)
      meta.setAttribute("content", previousDescription);
  });
}
