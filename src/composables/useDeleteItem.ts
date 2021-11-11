import { DeleteFunction, DjangoModel } from "@/types/shared";
import { ref, Ref } from "vue";

export default function useDeleteItem(
  deleteItemFunc: DeleteFunction,
  items: Ref<DjangoModel[]>,
) {
  const deleteModalOpen = ref(false);

  const deleteRequest: DeleteFunction = (data: DjangoModel) => {
    return deleteItemFunc(data).then(() => {
      deleteModalOpen.value = false;
      items.value = items.value.filter((item) => item.id !== data.id);
    });
  };

  return {
    deleteRequest,
    deleteModalOpen,
  };
}
