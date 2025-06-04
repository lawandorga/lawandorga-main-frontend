import { Ref, computed, ref, watch } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import {
  QueryParams,
  SetQueryParam,
} from "lorga-ui/dist/types/components/PaginationBar.vue";

export interface Record {
  token: string;
  attributes: { [key: string]: string | string[] };
  delete_requested: boolean;
  has_access: boolean;
  folder_uuid: string;
  data_sheet_uuid: string;
  uuid: string;
}

interface RecordsData {
  records: Record[] | undefined;
  total: number;
}

export function useRecords(
  tokenSearch: Ref<string>,
  yearSearch: Ref<string>,
  generalSearch: Ref<string>,
  orderBy: Ref<string>,
) {
  const client = useClient();

  const queryParams = ref<QueryParams>({
    offset: 0,
    limit: 10,
    token: tokenSearch.value,
    year: yearSearch.value,
    general: generalSearch.value,
    order_by: orderBy.value,
  });
  watch([tokenSearch, yearSearch, generalSearch, orderBy], () => {
    queryParams.value = {
      ...queryParams.value,
      token: tokenSearch.value,
      year: yearSearch.value,
      general: generalSearch.value,
      order_by: orderBy.value,
    };
  });

  const request = client.get(
    "/api/records/query/dashboard/?offset={offset}&limit={limit}&token={token}&year={year}&general={general}&order_by={order_by}",
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
