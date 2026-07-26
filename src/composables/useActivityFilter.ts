import { computed, ref, type Ref } from "vue";

import type { ActivityState } from "@/features/admin/api/useProfiles";

export type ActivityFilterOption = ActivityState | "all";

const activityOrder: Record<ActivityState, number> = {
  green: 1,
  yellow: 2,
  orange: 3,
  red: 4,
};

export function getActivitySortValue(
  item: Record<string, unknown>,
  key: string,
): string | number {
  if (key === "activity_state")
    return activityOrder[item.activity_state as ActivityState] ?? 0;
  const value = item[key];
  return typeof value === "string" || typeof value === "number" ? value : "";
}

export function useActivityFilter<T extends { activity_state: ActivityState }>(
  items: Ref<T[] | null>,
) {
  const activityFilter = ref<ActivityFilterOption>("all");

  function toggleFilter(value: ActivityFilterOption) {
    activityFilter.value = activityFilter.value === value ? "all" : value;
  }

  const filteredItems = computed<T[] | null>(() => {
    if (!items.value) return null;
    if (activityFilter.value === "all") return items.value;
    return items.value.filter(
      (item) => item.activity_state === activityFilter.value,
    );
  });

  return { activityFilter, toggleFilter, filteredItems };
}
