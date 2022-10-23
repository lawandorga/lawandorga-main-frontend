import moment from "moment";

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // return only the date if the date string has no time
  if (dateString.length === 10)
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
  shortYear: string;
  formatted: string;
  groupDate: string;
}

export const formatDateToObject = (date: Date): FormattedDate => {
  const momentDate = moment(date);
  return {
    day: momentDate.format("DD"),
    month: momentDate.format("MMMM"),
    shortMonth: momentDate.format("MMM"),
    shortYear: momentDate.format("YY"),
    year: momentDate.format("YYYY"),
    formatted: formatDate(momentDate.toISOString()),
    groupDate: momentDate.format("YYYY-MM-DD"),
  };
};
