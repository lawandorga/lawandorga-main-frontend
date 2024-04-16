import { computed, ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

interface Record {
  token: string;
  attributes: { [key: string]: string | string[] };
  delete_requested: boolean;
  has_access: boolean;
  folder_uuid: string;
}

interface View {
  uuid: string;
  name: string;
  columns: string[];
}

interface RecordsData {
  records: Record[];
  views: View[];
}

export function useRecords() {
  const client = useClient();
  const request = client.get("/api/records/query/dashboard/");

  const data = ref<RecordsData>();
  const query = useGet(request, data);

  const records = computed<Record[] | undefined>(() => {
    return data.value?.records;
  });

  const views = computed<View[]>(() => {
    if (!data.value) return [];
    return data.value?.views;
  });

  return {
    query,
    records,
    views,
  };
}
