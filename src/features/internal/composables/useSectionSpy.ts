import { onBeforeUnmount, onMounted, ref } from "vue";

import {
  getActiveSection,
  getReadingLine,
} from "@/features/internal/utils/landing";

/**
 * Tracks which of the given sections (by element id) the reader is in, for
 * the highlight in the anchor navigation. Updates on scroll and resize;
 * browsers fire scroll events at most once per frame and the check only
 * measures a handful of elements.
 */
export function useSectionSpy(ids: string[], enabled = true) {
  const activeId = ref<string | undefined>(undefined);

  const update = () => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { id: el.id, top: rect.top, bottom: rect.bottom };
      });
    activeId.value = getActiveSection(
      sections,
      getReadingLine(window.innerHeight),
    );
  };

  onMounted(() => {
    if (!enabled) return;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  });

  return { activeId, update };
}
