import { computed, Ref, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import useUrl from "@/composables/useUrl";

import { useFormYears } from "../composables/useFormYears";

interface RecordsCreatedClosed {
  years: number[];
  data: {
    month: string;
    created: number;
    closed: number;
  }[];
}

export function useCreatedAndClosed(year: Ref<number>) {
  const data = ref<RecordsCreatedClosed>();

  const url = useUrl("api/statistics/org/records_created_and_closed/", {
    queryParams: { year },
  });
  useGet2(url, data);

  const stats = computed(() => data.value?.data || []);
  const years = computed(() => data.value?.years);

  const { formYears } = useFormYears(years);

  return {
    stats,
    formYears,
  };
}
