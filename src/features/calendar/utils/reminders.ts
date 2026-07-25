import {
  DEFAULT_REMINDER,
  REMINDER_METHOD_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  type ReminderSettings,
} from "../constants";

export const toReminderKey = (reminder: ReminderSettings): string =>
  `${reminder.method}:${reminder.minutes_before}`;

export const findFreeReminderSlot = (
  taken: ReminderSettings[],
): ReminderSettings | null => {
  const takenKeys = new Set(taken.map(toReminderKey));
  const candidates: ReminderSettings[] = [
    DEFAULT_REMINDER,
    ...REMINDER_OFFSET_OPTIONS.flatMap((offset) =>
      REMINDER_METHOD_OPTIONS.map((method) => ({
        minutes_before: offset.value,
        method: method.value,
      })),
    ),
  ];
  return (
    candidates.find((candidate) => !takenKeys.has(toReminderKey(candidate))) ??
    null
  );
};
