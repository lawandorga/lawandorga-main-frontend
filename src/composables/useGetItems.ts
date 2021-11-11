import { DjangoModel, GetFunction } from "@/types/shared";
import { Ref, onMounted } from "vue";

export default function useGetItems(
  getItemsFunc: GetFunction,
  items: Ref<DjangoModel[]>,
) {
  const getItems = () => {
    getItemsFunc().then((newItems) => (items.value = newItems));
  };

  onMounted(getItems);
}
