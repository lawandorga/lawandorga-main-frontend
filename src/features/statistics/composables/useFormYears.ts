import { computed, Ref } from "vue";

export function useFormYears(years: Ref<number[] | undefined>) {
  const formYears = computed<{ name: string; value: number | undefined }[]>(
    () => {
      if (!years.value) return [];
      return [
        { name: "All", value: undefined },
        ...years.value.map((year) => {
          return {
            name: year.toString(),
            value: year,
          };
        }),
      ];
    },
  );

  return { formYears };
}
