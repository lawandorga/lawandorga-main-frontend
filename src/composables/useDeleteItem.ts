import { DjangoModel, JsonModel, Reffed } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useDeleteItem<
  Fn extends (...args: any[]) => Promise<void>, // eslint-disable-line
>(
  deleteItemFunc: Fn,
  items: Ref<DjangoModel[] | null>,
  ...params: Reffed<Parameters<Fn>>
) {
  const deleteModalOpen = ref(false);

  const deleteRequest = (data: JsonModel) => {
    return deleteItemFunc(data, ...params.map(unref)).then(() => {
      deleteModalOpen.value = false;

      if (Array.isArray(items.value)) {
        let index = -1;

        if ("url" in data)
          index = items.value.findIndex((item) =>
            "url" in item ? item.url === data.url : false,
          );
        else index = items.value.findIndex((item) => item.id === data.id);

        if (index !== -1) items.value.splice(index, 1);
      } else {
        items.value = [];
      }

      return data;
    });
  };

  return {
    deleteRequest,
    deleteModalOpen,
  };
}
