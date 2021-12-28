import { DjangoModel, Reffed } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useUpdateItem<
Fn extends (...args: any[]) => Promise<DjangoModel>, // eslint-disable-line
>(
  updateItemFunc: Fn,
  items: Ref<DjangoModel[] | DjangoModel | null>,
  ...params: Reffed<Parameters<Fn>>
) {
  const updateModalOpen = ref(false);

  const updateRequest = (data: DjangoModel) => {
    return updateItemFunc(data, ...params.map(unref)).then((newItem) => {
      updateModalOpen.value = false;

      if (Array.isArray(items.value)) {
        let index = -1;

        if ("url" in newItem)
          index = items.value.findIndex((item) =>
            "url" in item ? item.url === newItem.url : false,
          );
        else index = items.value.findIndex((item) => item.id === newItem.id);

        if (index !== -1) items.value.splice(index, 1, newItem);
      } else {
        items.value = [newItem];
      }

      return newItem;
    });
  };

  return {
    updateRequest,
    updateModalOpen,
  };
}
