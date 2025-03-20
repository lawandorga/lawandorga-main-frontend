import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, Ref, ref } from "vue";
import { useFormYears } from "../composables/useFormYears";

interface Data {
  stats: Record<string, number>;
  years: number[];
}

export function useRecordTags(year: Ref<number>) {
  const data = ref<Data>();

  const client = useClient();
  const request = client.get(
    "api/statistics/individual/tag_stats/?year={}",
    year,
  );
  useGet(request, data, year);

  const stats = computed(() => data.value?.stats);
  const years = computed(() => data.value?.years);

  const { formYears } = useFormYears(years);

  return {
    stats,
    years,
    formYears,
  };
}
