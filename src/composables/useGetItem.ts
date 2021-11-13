import { DjangoModel, GetSingleFunction } from "@/types/shared";
import { Ref, onMounted } from "vue";

export default function useGetItems(
  getItemFunc: GetSingleFunction,
  item: Ref<DjangoModel | null>,
  id: number | string,
) {
  const getItem = () => {
    getItemFunc(id).then((newItem) => (item.value = newItem));
  };

  onMounted(getItem);
}
