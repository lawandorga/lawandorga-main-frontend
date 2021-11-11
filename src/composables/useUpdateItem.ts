import { DjangoModel, RequestFunction } from "@/types/shared";
import { ref, Ref } from "vue";

export default function useUpdateItem(
  updateItemFunc: RequestFunction,
  items: Ref<DjangoModel[]>,
) {
  const updateModalOpen = ref(false);

  const updateRequest: RequestFunction = (data: DjangoModel) => {
    return updateItemFunc(data).then((newItem) => {
      updateModalOpen.value = false;

      const index = items.value.findIndex((item) => item.id === newItem.id);
      if (index !== -1) items.value.splice(index, 1, newItem);

      return newItem;
    });
  };

  return {
    updateRequest,
    updateModalOpen,
  };
}
