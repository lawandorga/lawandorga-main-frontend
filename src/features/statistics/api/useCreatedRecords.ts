import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface CreatedRecords {
  year: number;
  created: number;
}

export function useCreatedRecords() {
  const data = ref<CreatedRecords[]>();
  useGet2("api/statistics/record/created_records/", data);

  return {
    data,
  };
}
