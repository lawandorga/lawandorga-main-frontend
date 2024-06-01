import { useErrorHandling } from "@/api/errors";
import { JsonModel } from "@/types_deprecated/shared";
import { ref, Ref, unref } from "vue";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

export default function useCreate<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Type extends { [key: string]: any; id: number | string },
  Fn extends (...args: any[]) => Promise<Type | Type[]>,
  /* eslint-enable */
>(
  createFunc: Fn,
  items: Ref<Type | Type[] | null>,
  ...params: Nullable<Parameters<Fn>>
) {
  const createModalOpen = ref(false);

  const { handleCommandError } = useErrorHandling();

  const createRequest = (data: JsonModel): Promise<Type | Type[] | void> => {
    return createFunc(data, ...params.map(unref))
      .then((newItem) => {
        if (items.value === null) items.value = [];
        items.value.push(newItem);
        createModalOpen.value = false;
        return newItem;
      })
      .catch(handleCommandError);
  };

  const temporary = ref<Type | null>(null);

  return {
    temporary,
    createRequest,
    createModalOpen,
  };
}
