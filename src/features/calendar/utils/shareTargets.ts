export type CalendarGrantTargetType = "user" | "group" | "org";

export const getGrantTargetKey = (
  type: CalendarGrantTargetType,
  id: number,
): string => `${type}:${id}`;
