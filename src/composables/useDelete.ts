import { Reffed } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useDelete<
  /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
  Type extends { [key: string]: any; id: string | number },
  Fn extends (item: Type, ...args: any) => Promise<void>,
  /* eslint-enable */
>(
  deleteFunc: Fn,
  items: Ref<Type[] | Type | null> | null,
  ...params: Reffed<Parameters<Fn>>
) {
  const deleteModalOpen = ref(false);

  function deleteRequest(data: Type): Promise<void> {
    return deleteFunc(data, ...params.map(unref)).then(() => {
      // close modal
      deleteModalOpen.value = false;

      // safety
      if (items === null) return;

      // update items
      if (Array.isArray(items.value)) {
        items.value = items.value.filter(
          (item) => item && data && item.id && item.id !== data.id,
        );
      } else {
        items.value === null;
      }

      // trigger computed setter
      // eslint-disable-next-line no-self-assign
      items.value = items.value;

      // return nothing
      return;
    });
  }

  const temporary = ref<Type | null>(null);

  return {
    temporary,
    deleteRequest,
    deleteModalOpen,
  };
}
