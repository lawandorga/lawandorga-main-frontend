import { JsonModel, Reffed, RequestFunction } from "@/types/shared";
import { ref, Ref, unref } from "vue";

export default function useCreateItem<
  Fn extends (...args: any[]) => Promise<any>, // eslint-disable-line
>(
  createItemFunc: Fn,
  items: Ref<any[] | null>,  // eslint-disable-line
  ...params: Reffed<Parameters<Fn>>
) {
  const createModalOpen = ref(false);

  const createRequest: RequestFunction = (data: JsonModel) => {
    return createItemFunc(data, ...params.map(unref)).then((newItem) => {
      if (items.value === null) items.value = [];
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
