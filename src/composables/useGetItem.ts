import { DjangoModel, Reffed } from "@/types/shared";
import { Ref, watch, unref } from "vue";

export default function useGetItems<
  Fn extends (...args: any[]) => Promise<DjangoModel>, // eslint-disable-line
>(
  getItemFunc: Fn,
  item: Ref<DjangoModel | null>,
  id: string | number,
  ...params: Reffed<Parameters<Fn>>
) {
  const getItem = () => {
    getItemFunc(id, ...params.map(unref)).then(
      (newItem) => (item.value = newItem),
    );
  };

  watch(params, getItem);
  if (params.length === 0) getItem();
}
