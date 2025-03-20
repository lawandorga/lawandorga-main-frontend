import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, Ref, ref } from "vue";
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

  const client = useClient();

  const request = client.get(
    "api/statistics/org/records_created_and_closed/?year={}",
    year,
  );
  useGet(request, data, year);

  const stats = computed(() => data.value?.data || []);
  const years = computed(() => data.value?.years);

  const { formYears } = useFormYears(years);

  return {
    stats,
    formYears,
  };
}
