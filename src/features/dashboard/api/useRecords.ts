import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Record {
  identifier: string;
  folder_uuid: string;
  state: string;
  uuid: string;
}

export function useRecords() {
  const records = ref<Record[] | null>();
  useGet2("/api/data_sheets/query/dashboard/", records);

  return {
    records,
  };
}
