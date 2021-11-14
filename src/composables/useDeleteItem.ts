import { DeleteFunction, DjangoModel, JsonModel, Reffed } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useDeleteItem<
  Fn extends (...args: any[]) => Promise<void>, // eslint-disable-line
>(
  deleteItemFunc: Fn,
  items: Ref<DjangoModel[]>,
  ...params: Reffed<Parameters<Fn>>
) {
  const deleteModalOpen = ref(false);

  const deleteRequest: DeleteFunction = (data: JsonModel) => {
    return deleteItemFunc(data, ...params.map(unref)).then(() => {
      deleteModalOpen.value = false;
      items.value = items.value.filter((item) => item.id !== data.id);
    });
  };

  return {
    deleteRequest,
    deleteModalOpen,
  };
}
