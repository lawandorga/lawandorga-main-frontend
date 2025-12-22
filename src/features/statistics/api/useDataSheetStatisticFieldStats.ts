import { computed, Ref, ref } from "vue";
import { useFormYears } from "../composables/useFormYears";
import useGet2 from "@/composables/useGet2";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

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

  const client = useClient();
  const request = client.get(
    "api/statistics/org/data_sheet_statistic_fields/?year={}",
    year,
  );
  useGet(request, data, year);

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
