import { useErrorHandling } from "@/api/errors";
import { Reffed } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useUpdate<
  /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
  Type extends { [key: string]: any; id: string | number },
  Fn extends (item: Type, ...args: any) => Promise<Type>,
  /* eslint-enable */
>(
  updateFunc: Fn,
  items: Ref<Type[] | Type | null> | null,
  ...params: Reffed<Parameters<Fn>>
) {
  const updateModalOpen = ref(false);

  const { handleCommandError } = useErrorHandling();

  function updateRequest(data: Type): Promise<Type | void> {
    return updateFunc(data, ...params.map(unref))
      .then((newItem) => {
        // close modal
        updateModalOpen.value = false;

        if (items === null) return newItem;

        // update items
        if (Array.isArray(items.value)) {
          let index = -1;

          if ("url" in newItem)
            index = items.value.findIndex((item) =>
              "url" in item ? item.url === newItem.url : false,
            );
          else if ("type" in newItem)
            index = items.value.findIndex(
              (item) => item.id === data.id && item.type === data.type,
            );
          else index = items.value.findIndex((item) => item.id === newItem.id);

          if (index !== -1) items.value.splice(index, 1, newItem);
        } else if (!items.value) {
          items.value = [newItem];
        } else {
          items.value = newItem;
        }

        // trigger computed setter
        // eslint-disable-next-line no-self-assign
        items.value = items.value;

        // return the new item
        return newItem;
      })
      .catch(handleCommandError);
  }

  const temporary = ref<Type | null>(null);

  return {
    temporary,
    updateRequest,
    updateModalOpen,
  };
}
