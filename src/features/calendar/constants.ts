export const EVENT_SOURCE_META = {
  PERSONAL: { label: "Personal", color: "#003c4d" },
  SHARED: { label: "Shared", color: "#5a3e8a" },
  ORGANIZATION: { label: "Organization", color: "#0f6e56" },
} as const;

export const EVENT_TYPE_META = {
  APPOINTMENT: { label: "Appointment", color: "#2563eb" },
  TASK: { label: "Task", color: "#16a34a" },
  MEETING: { label: "Meeting", color: "#7c3aed" },
  DEADLINE: { label: "Deadline", color: "#dc2626" },
  EXTERNAL: { label: "External", color: "#d97706" },
} as const;
