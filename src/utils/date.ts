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
