import { REMINDER_CANDIDATES, type ReminderSettings } from "../constants";

export const toReminderKey = (reminder: ReminderSettings): string =>
  `${reminder.method}:${reminder.minutes_before}`;

export const findFreeReminderSlot = (
  taken: ReminderSettings[],
  minutesUntilStart: number | null,
): ReminderSettings | null => {
  const takenKeys = new Set(taken.map(toReminderKey));
  return (
    REMINDER_CANDIDATES.find(
      (candidate) =>
        !takenKeys.has(toReminderKey(candidate)) &&
        (minutesUntilStart === null ||
          candidate.minutes_before < minutesUntilStart),
    ) ?? null
  );
};
