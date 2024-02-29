export type ImportedMail = {
  uuid: string;
  sender: string;
  bcc: string;
  subject: string;
  content: string;
  sending_datetime: Date;
  is_read: boolean;
  is_pinned: boolean;
};

export type Sorting = "asc" | "desc";

export type PossibleDisplayedFields = "subject" | "sender" | "sending_datetime";

// eslint-disable-next-line no-unused-vars
export type DisplayedFieldsObject = { [F in PossibleDisplayedFields]: boolean };
