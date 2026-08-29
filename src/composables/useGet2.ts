import { Ref } from "vue";

import useQuery2 from "./useQuery2";

function useGet2<Type>(
  url: string | Ref<string>,
  obj: Ref<Type | undefined>,
): () => void {
  const query = useQuery2(url, obj);

  query();

  return query;
}

export default useGet2;
