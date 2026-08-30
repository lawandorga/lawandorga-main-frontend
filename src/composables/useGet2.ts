import { Ref } from "vue";

import useQuery2, { UseQueryOptions } from "./useQuery2";

function useGet2<Type>(
  url: string | Ref<string | undefined>,
  obj: Ref<Type | undefined>,
  options?: UseQueryOptions,
): () => void {
  const query = useQuery2(url, obj, options);

  query();

  return query;
}

export default useGet2;
