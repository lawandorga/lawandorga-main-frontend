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
