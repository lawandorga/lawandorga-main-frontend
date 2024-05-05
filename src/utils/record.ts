import { formatDate } from "./date";

export const getValueFromEntry = (
  entry: Record<string, unknown>,
  defaultValue = "",
): string => {
  if ((entry.type === "date" || entry.type === "datetime-local") && typeof entry.value === "string")
    return formatDate(entry.value);
  else if ((entry.type === "text" || entry.type === "select") && typeof entry.value === "string") return entry.value;
  else if (entry.type === "multiple" && Array.isArray(entry.value))
    return entry.value.join(", ");
  return defaultValue;
};
