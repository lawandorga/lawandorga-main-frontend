import { Ref, watch, unref, computed, isRef } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

function useGet<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Type extends { [key: string]: any; id: number },
  Fn extends (...args: any[]) => Promise<Type | Type[]>,
  /* eslint-enable */
>(
  getFunc: Fn,
  obj: Ref<Type | Type[] | null>,
  ...params: Nullable<Parameters<Fn>>
) {
  const getRequest = () => {
    getFunc(...params.map(unref)).then((newItem) => (obj.value = newItem));
  };

  const refParams = computed(() => {
    return params.filter((p) => isRef(p));
  });

  watch(refParams.value, getRequest);

  if (refParams.value.length === 0) getRequest();
}

export default useGet;
