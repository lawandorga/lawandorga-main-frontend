import { DjangoModel, RequestFunction } from "@/types/shared";
import { ref, Ref } from "vue";

export default function useCreateItem(
  createItemFunc: RequestFunction,
  items: Ref<DjangoModel[]>,
) {
  const createModalOpen = ref(false);

  const createRequest: RequestFunction = (data: DjangoModel) => {
    return createItemFunc(data).then((newItem) => {
      items.value.push(newItem);
      createModalOpen.value = false;
      return newItem;
    });
  };

  return {
    createRequest,
    createModalOpen,
  };
}
