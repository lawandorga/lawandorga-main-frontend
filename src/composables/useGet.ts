import { useErrorHandling } from "@/api/errors";
import { Ref, watch, unref, computed, isRef } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

function useGet<
  Type,
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Fn extends (...args: any[]) => Promise<Type>,
  /* eslint-enable */
>(
  getFunc: Fn,
  obj: Ref<Type | undefined>,
  ...params: Nullable<Parameters<Fn>>
): () => void {
  const { handleQueryError } = useErrorHandling();

  const getRequest = () => {
    getFunc(...params.map(unref))
      .then((newItem) => {
        obj.value = newItem;
      })
      .catch(handleQueryError);
  };

  const refParams = computed(() => {
    return params.filter((p) => isRef(p));
  });

  watch(refParams.value, () => {
    obj.value = undefined;
    getRequest();
  });

  if (
    refParams.value.length === 0 ||
    params.map(unref).every((i) => i !== null)
  )
    getRequest();

  return getRequest;
}

export default useGet;
