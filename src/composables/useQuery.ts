import { Ref, unref } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

function useGet<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Type extends { [key: string]: any; id: number | string },
  Fn extends (...args: any[]) => Promise<Type | Type[]>,
  /* eslint-enable */
>(
  getFunc: Fn,
  obj: Ref<Type | Type[] | null>,
  ...params: Nullable<Parameters<Fn>>
): () => void {
  const getRequest = () => {
    getFunc(...params.map(unref)).then((newItem) => (obj.value = newItem));
  };

  return getRequest;
}

export default useGet;
