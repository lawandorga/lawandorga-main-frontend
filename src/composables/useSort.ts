import { ref } from "vue";

type Value =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | { name: string; id: number }[];

export default function useSort() {
  const sortOrder = ref("");
  const sortBy = ref("");

  const changeSortOrder = () => {
    if (sortOrder.value === "") sortOrder.value = "ASC";
    else if (sortOrder.value === "ASC") sortOrder.value = "DESC";
    else if (sortOrder.value === "DESC") {
      sortOrder.value = "";
      sortBy.value = "";
    }
  };

  const changeSort = (value: string) => {
    if (value === sortBy.value) {
      changeSortOrder();
    } else {
      sortBy.value = value;
      sortOrder.value = "ASC";
    }
  };

  const sortValues = (v1: Value, v2: Value) => {
    const modifier = sortOrder.value === "ASC" ? -1 : 1;
    if (Array.isArray(v1) || Array.isArray(v2)) return 0;
    if (typeof v1 === "string" && typeof v2 === "string")
      return (
        v1.toLocaleLowerCase().localeCompare(v2.toLocaleLowerCase()) * modifier
      );
    return 0;
  };

  return {
    sortOrder,
    changeSort,
    sortBy,
    sortValues,
  };
}
