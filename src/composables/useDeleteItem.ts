import { DeleteFunction, DjangoModel, JsonModel } from "@/types/shared";
import { ref, Ref } from "vue";

export default function useDeleteItem(
  deleteItemFunc: DeleteFunction,
  items: Ref<DjangoModel[]>,
  item?: Ref<DjangoModel>,
) {
  const deleteModalOpen = ref(false);

  const deleteRequest: DeleteFunction = (data: JsonModel) => {
    return deleteItemFunc(data, item?.value).then(() => {
      deleteModalOpen.value = false;
      items.value = items.value.filter((item) => item.id !== data.id);
    });
  };

  return {
    deleteRequest,
    deleteModalOpen,
  };
}
