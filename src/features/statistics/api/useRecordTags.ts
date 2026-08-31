import { computed, Ref, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import useUrl from "@/composables/useUrl";

import { useFormYears } from "../composables/useFormYears";

interface Data {
  stats: Record<string, number>;
  years: number[];
}

export function useRecordTags(year: Ref<number>) {
  const data = ref<Data>();

  const url = useUrl("api/statistics/individual/tag_stats/", {
    queryParams: { year },
  });
  useGet2(url, data);

  const stats = computed(() => data.value?.stats);
  const years = computed(() => data.value?.years);

  const { formYears } = useFormYears(years);

  return {
    stats,
    years,
    formYears,
  };
}
