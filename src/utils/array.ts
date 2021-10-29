import { DjangoModel } from "@/types/shared";

export const removeFromArray = (
  array: DjangoModel[],
  id: number,
): DjangoModel[] => {
  const newArray = array.filter((item) => item.id !== id);
  return newArray;
};
