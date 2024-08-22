import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Record {
  identifier: string;
  folder_uuid: string;
  updated: string;
  uuid: string;
}

export function useChangedRecords() {
  const changedRecords = ref<Record[] | null>();
  useGet2("/api/records/query/dashboard/changed/", changedRecords);

  return {
    changedRecords,
  };
}
