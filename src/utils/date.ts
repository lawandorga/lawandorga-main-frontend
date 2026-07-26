export const formatDate = (
  dateString: string,
  dateOnly: boolean = false,
  timeOnly: boolean = false,
) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (dateOnly || dateString.length === 10)
    return new Intl.DateTimeFormat("de-de", {
      dateStyle: "short",
      timeStyle: "short",
    })
      .format(date)
      .split(",")[0];

  if (timeOnly)
    return new Intl.DateTimeFormat("de-de", {
      dateStyle: "short",
      timeStyle: "short",
    })
      .format(date)
      .split(",")[1]
      .trim();

  return new Intl.DateTimeFormat("de-de", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export interface FormattedDate {
  day: string;
  month: string;
  shortMonth: string;
  year: string;
  formatted: string;
  groupDate: string;
}

export const formatDateToObject = (dateString: string): FormattedDate => {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString(),
    month: date.getMonth().toString(),
    shortMonth: date.toLocaleDateString("default", { month: "short" }),
    year: date.getFullYear().toString(),
    formatted: formatDate(date.toISOString()),
    groupDate: date.toLocaleDateString(),
  };
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const dateWithTimeOf = (date: string, dateTime: string): string => {
  const timeOfDay = dateTime.split("T")[1]; // e.g. "06:30:00Z", "08:30:00+02:00"
  return timeOfDay ? `${date}T${timeOfDay}` : date;
};

export const toLocalDateTimeInput = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
