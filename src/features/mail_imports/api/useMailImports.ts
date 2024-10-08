import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { Ref, ref } from "vue";

export type MailAttachment = {
  name: string;
  uuid: string;
};

export type ImportedMail = {
  uuid: string;
  sender: string;
  to: string;
  cc: string;
  subject: string;
  content: string;
  sending_datetime: string;
  is_read: boolean;
  is_pinned: boolean;
  mail_attachments: Array<MailAttachment>;
};

export function useMailImports(folderUuid: Ref<string>) {
  const client = useClient();
  const mails = ref<ImportedMail[]>();
  const mailRequest = client.get(
    "api/mail_imports/query/folder_mails/{}/",
    folderUuid,
  );
  const mailQuery = useGet(mailRequest, mails);

  return {
    mailQuery,
    mails,
  };
}
