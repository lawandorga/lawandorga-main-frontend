export const EVENT_SOURCE_META = {
  PERSONAL: { label: "Personal", color: "#003c4d" },
  SHARED: { label: "Shared", color: "#5a3e8a" },
  ORGANIZATION: { label: "Organization", color: "#0f6e56" },
} as const;

export type EventSource = keyof typeof EVENT_SOURCE_META;

export const EVENT_TYPE_META = {
  APPOINTMENT: { label: "Appointment", color: "#2563eb" },
  TASK: { label: "Task", color: "#16a34a" },
  MEETING: { label: "Meeting", color: "#7c3aed" },
  DEADLINE: { label: "Deadline", color: "#dc2626" },
  EXTERNAL: { label: "External", color: "#d97706" },
} as const;

export type EventType = keyof typeof EVENT_TYPE_META;

export const TYPE_TINT_ALPHA = "20";

export const RECURRENCE_FREQUENCIES = [
  { rule: "FREQ=DAILY", label: "Daily", fullCalendarFreq: "daily" },
  { rule: "FREQ=WEEKLY", label: "Weekly", fullCalendarFreq: "weekly" },
  { rule: "FREQ=MONTHLY", label: "Monthly", fullCalendarFreq: "monthly" },
  { rule: "FREQ=YEARLY", label: "Yearly", fullCalendarFreq: "yearly" },
] as const;

export const REMINDER_OFFSET_OPTIONS = [
  { minutes: 0, label: "At start of event" },
  { minutes: 10, label: "10 minutes before" },
  { minutes: 30, label: "30 minutes before" },
  { minutes: 60, label: "1 hour before" },
  { minutes: 1440, label: "1 day before" },
] as const;

export const REMINDER_METHOD_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "IN_APP", label: "In-app" },
] as const;

export type ReminderMethod = (typeof REMINDER_METHOD_OPTIONS)[number]["value"];

export interface ReminderSettings {
  minutes_before: number;
  method: ReminderMethod;
}

export const DEFAULT_REMINDER: ReminderSettings = {
  minutes_before: 30,
  method: "IN_APP",
};
