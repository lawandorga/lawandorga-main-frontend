import { formatDate } from "./date";
import { types } from "@lawandorga/components";

export const getValueFromEntry = (
  entry: types.JsonModel,
  defaultValue = "",
): string => {
  if (entry.type === "date" || entry.type === "datetime-local")
    return formatDate(entry.value);
  else if (entry.type === "text" || entry.type === "select") return entry.value;
  else if (entry.type === "multiple" && Array.isArray(entry.value))
    return entry.value.join(", ");
  return defaultValue;
};

export const getValueFromRecord = (
  r: types.JsonModel,
  key: string,
  defaultValue = "",
): string => {
  const entry = r.entries[key];

  if (entry !== undefined) return getValueFromEntry(entry, defaultValue);
  return defaultValue;
};
