export const formatDate = (dateString: string, dateOnly: boolean = false) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // return only the date if the date string has no time
  if (dateOnly || dateString.length === 10)
    return new Intl.DateTimeFormat("de-de", {
      dateStyle: "short",
      timeStyle: "short",
    })
      .format(date)
      .split(",")[0];
  // then specify how you want your dates to be formatted
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
