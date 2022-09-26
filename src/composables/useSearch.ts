import { ref, computed, Ref } from "vue";

export default function useSearch<T, K>(
  items: Ref<T[] | null>,
  keys: Ref<K[]>,
  // eslint-disable-next-line no-unused-vars
  getValue: (item: T, key: K) => string,
) {
  const search = ref("");

  const filter = computed(() => search.value.toLowerCase());

  const checkObjectContains = <T extends object>(item: T) => {
    for (const key of Object.keys(item)) {
      const value = item[key as keyof typeof item];
      if (value !== null && typeof value === "object") {
        if (checkObjectContains(value)) return true;
      } else if (typeof value === "string") {
        if (value.toLowerCase().includes(filter.value)) return true;
      }
    }
    return false;
  };

  const filterFunc = computed(() => (item: T): boolean => {
    const filter = search.value.toLowerCase();

    for (const key of keys.value) {
      if (getValue(item, key).toLowerCase().includes(filter)) return true;
    }

    if (item !== null && typeof item === "object" && checkObjectContains(item))
      return true;

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
