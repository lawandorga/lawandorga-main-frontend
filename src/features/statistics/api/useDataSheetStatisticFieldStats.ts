import { computed, Ref, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import useUrl from "@/composables/useUrl";

import { useFormYears } from "../composables/useFormYears";

interface DataSheetStatisticFieldStats {
  stats: {
    [field: string]: {
      [value: string]: number;
    };
  };
  years: number[];
}

export function useDataSheetStatisticFieldStats(year: Ref<number | undefined>) {
  const data = ref<DataSheetStatisticFieldStats>();

  const url = useUrl("api/statistics/org/data_sheet_statistic_fields/", {
    queryParams: { year },
  });
  useGet2(url, data);

  const stats = computed<DataSheetStatisticFieldStats["stats"]>(
    () => data.value?.stats || {},
  );
  const years = computed(() => data.value?.years || []);

  const { formYears } = useFormYears(years);

  return {
    stats,
    formYears,
  };
}
