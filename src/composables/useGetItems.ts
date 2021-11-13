import { DjangoModel } from "@/types/shared";
import { Ref, onMounted, watch, unref } from "vue";

type Mapper<Type> = typeof Type;

export default function useGetItems<
  Fn extends (...args: any[]) => Promise<DjangoModel[]>, // eslint-disable-line
>(
  getItemsFunction: Fn,
  items: Ref<DjangoModel[]>,
  ...params: Mapper<Parameters<Fn>>
) {
  const getItems = () => {
    getItemsFunction(...params.map(unref)).then(
      (newItems) => (items.value = newItems),
    );
  };

  watch(params, getItems);
}
