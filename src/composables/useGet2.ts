import { Ref } from "vue";

import useClient from "@/api/client";

import useQuery from "./useQuery";

function useGet2<Type>(
  url: string,
  obj: Ref<Type | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...watching: Ref<any>[]
): () => void {
  const client = useClient();
  const request = client.get(url);
  const query = useQuery(request, obj, ...watching);

  query();

  return query;
}

export default useGet2;
