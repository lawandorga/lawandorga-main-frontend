import { Ref, unref } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

function useQuery<
  Type,
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Fn extends (...args: any[]) => Promise<Type>,
  /* eslint-enable */
>(
  getFunc: Fn,
  obj: Ref<Type>,
  ...params: Nullable<Parameters<Fn>>
): () => Promise<void> {
  const getRequest = () => {
    return getFunc(...params.map(unref)).then((newItem) => {
      obj.value = newItem;
    });
  };

  return getRequest;
}

export default useQuery;
