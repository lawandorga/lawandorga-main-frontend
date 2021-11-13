import { DjangoModel, JsonModel, RequestFunction } from "@/types/shared";
import { ref, Ref } from "vue";

export default function useCreateItem(
  createItemFunc: RequestFunction,
  items: Ref<DjangoModel[]>,
  item?: Ref<DjangoModel>,
) {
  const createModalOpen = ref(false);

  const createRequest: RequestFunction = (data: JsonModel) => {
    return createItemFunc(data, item?.value).then((newItem) => {
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
