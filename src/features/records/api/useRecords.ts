import { Ref, computed, ref, watch } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import {
  QueryParams,
  SetQueryParam,
} from "lorga-ui/dist/types/components/PaginationBar.vue";

interface Record {
  token: string;
  attributes: { [key: string]: string | string[] };
  delete_requested: boolean;
  has_access: boolean;
  folder_uuid: string;
}

interface RecordsData {
  records: Record[] | undefined;
  total: number;
}

export function useRecords(search: Ref<string>, year: Ref<string>) {
  const client = useClient();

  const queryParams = ref<QueryParams>({
    offset: 0,
    limit: 10,
    token: search.value,
    year: year.value,
  });
  watch([search, year], () => {
    queryParams.value = {
      ...queryParams.value,
      token: search.value,
      year: year.value,
    };
  });

  const request = client.get(
    "/api/records/query/dashboard/?offset={offset}&limit={limit}&token={token}&year={year}",
  );

  const data = ref<RecordsData>();
  const query = useGet(request, data, queryParams);

  const records = computed<Record[] | undefined>(() => {
    return data.value?.records;
  });

  const total = computed<number>(() => {
    return data.value?.total || 0;
  });

  const setQueryParam: SetQueryParam = (key, value) => {
    queryParams.value = { ...queryParams.value, [key]: value };
    if (data.value) data.value.records = undefined;
    return queryParams.value;
  };

  return {
    query,
    records,
    total,
    queryParams,
    setQueryParam,
  };
}
