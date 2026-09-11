import { isRef, Ref, ref, watch } from "vue";

import useClient from "@/api/client";
import { useErrorHandling } from "@/api/errors";

export interface UseQueryOptions {
  autoFetchOnUrlChange?: boolean;
}

function useQuery2<Type>(
  url: string | Ref<string | undefined>,
  obj: Ref<Type | undefined>,
  options: UseQueryOptions = { autoFetchOnUrlChange: true },
): () => Promise<void> {
  const client = useClient();
  const request = client.get2(isRef(url) ? url : ref(url));

  const { handleQueryError } = useErrorHandling();

  const query = () => {
    return request()
      .then((newItem) => {
        obj.value = newItem;
      })
      .catch(handleQueryError);
  };

  if (options.autoFetchOnUrlChange && isRef(url)) {
    watch(url, () => {
      if (url.value) query();
    });
  }

  return query;
}

export default useQuery2;
