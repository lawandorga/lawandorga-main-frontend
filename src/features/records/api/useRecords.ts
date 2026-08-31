import { Ref, computed, ref, watch } from "vue";

import useGet2 from "@/composables/useGet2";
import useUrl from "@/composables/useUrl";
type QueryParams = {
  [key: string]: number | string | string[] | null | boolean | undefined;
};
type SetQueryParam = (key: string, value: QueryParams[string]) => QueryParams;

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

  const data = ref<RecordsData>();
  const url = useUrl("/api/records/query/dashboard/", {
    queryParams: queryParams,
  });
  const query = useGet2(url, data);

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
