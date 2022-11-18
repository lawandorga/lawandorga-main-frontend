import { Ref, watch, unref, computed, isRef } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

function useGet<
  Type,
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Fn extends (...args: any[]) => Promise<Type>,
  /* eslint-enable */
>(getFunc: Fn, obj: Ref<Type>, ...params: Nullable<Parameters<Fn>>) {
  const getRequest = () => {
    getFunc(...params.map(unref)).then((newItem) => (obj.value = newItem));
  };

  const refParams = computed(() => {
    return params.filter((p) => isRef(p));
  });

  watch(refParams.value, getRequest);

  if (refParams.value.length === 0) getRequest();
  else if (params.map(unref).every((i) => i !== null)) getRequest();
}

export default useGet;
