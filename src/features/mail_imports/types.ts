export type Sorting = "asc" | "desc";

export type PossibleDisplayedFields = "subject" | "sender" | "sending_datetime";

// eslint-disable-next-line no-unused-vars
export type DisplayedFieldsObject = { [F in PossibleDisplayedFields]: boolean };
