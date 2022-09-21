import { ref, computed, Ref } from "vue";

export default function useSearch<T, K>(
  items: Ref<T[] | null>,
  keys: Ref<K[]>,
  // eslint-disable-next-line no-unused-vars
  getValue: (item: T, key: K) => string,
) {
  const search = ref("");

  const filterFunc = computed(() => (item: T): boolean => {
    const filter = search.value.toLowerCase();

    for (const key of keys.value) {
      if (getValue(item, key).toLowerCase().includes(filter)) return true;
    }

    return false;
  });

  const filteredItems = computed<T[] | null>(() => {
    if (items.value === null) return null;
    return items.value.filter(filterFunc.value);
  });

  return {
    search,
    filteredItems,
  };
}
