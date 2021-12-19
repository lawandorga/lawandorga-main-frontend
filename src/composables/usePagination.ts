import { ref, Ref, computed, watch } from "vue";

export default function usePagination(items: Ref<any[] | null>, perPage: 12) {
  const pages = computed(() => {
    if (items.value === null) return [1];
    return Array.from(
      Array(Math.ceil(items.value.length / perPage)).keys(),
    ).map((i) => (i += 1));
  })

  const current = ref(1)

  const start = computed(() =>  {
    if (items.value === null || items.value.length === 0) return 0;
    return (current.value - 1) * perPage + 1;
  })

  const end = computed(() => {
    if (items.value === null) return 0;
    return Math.min(current.value * perPage, items.value.length);
  })

  const total = computed(() => {
      if (items.value === null) return 0;
      return items.value.length;
  })

  const paginatedData = computed(() => {
    if (items.value === null) return null;
    return items.value.slice(start.value -1, end.value)
  })

const previous = () => {
    current.value = Math.max(current.value - 1, 1)
}

  const next = () => {
    current.value = Math.min(current.value + 1, pages.value.length)
  }

  const setPage = (n: number) => {
      current.value = Math.max(1, Math.min(n, pages.value.length))
  }

  watch(items, () => {
    if (!pages.value.includes(current.value)) current.value = 1
  })

  return {
    pages,
    start, end,
    paginatedData,
    total,
    previous, next, setPage,
  };
}
