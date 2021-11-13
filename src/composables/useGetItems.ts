import { DjangoModel, GetMultipleFunction } from "@/types/shared";
import { Ref, onMounted, watch } from "vue";

export default function useGetItems(
  getItemsFunc: GetMultipleFunction,
  items: Ref<DjangoModel[]>,
  item?: Ref<DjangoModel>,
) {
  const getItems = () => {
    if (item)
      getItemsFunc(item.value).then((newItems) => (items.value = newItems));
    else getItemsFunc().then((newItems) => (items.value = newItems));
  };

  if (item) watch(item, () => getItems());
  else onMounted(getItems);
}
