import { isRef, Ref, ref, watch } from "vue";

import useClient from "@/api/client";
import { handleQueryError } from "@/api/errors";

function useQuery2<Type>(
  url: string | Ref<string>,
  obj: Ref<Type | undefined>,
): () => void {
  const client = useClient();
  const request = client.get2(isRef(url) ? url : ref(url));

  const query = () => {
    return request()
      .then((newItem) => {
        obj.value = newItem;
      })
      .catch(handleQueryError);
  };

  if (isRef(url)) {
    watch(url, () => {
      query();
    });
  }

  return query;
}

export default useQuery2;
