import { computed, Ref, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import useUrl from "@/composables/useUrl";

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
  const mails = ref<ImportedMail[]>();
  const url = useUrl("api/mail_imports/query/folder_mails/{}/", {
    pathParams: { 0: folderUuid },
  });
  const mailQuery = useGet2(url, mails);

  const numberOfUnreadMails = computed(() => {
    const count = mails.value?.filter((mail) => !mail.is_read).length;
    if (!count) return "";
    return count.toString();
  });

  return {
    mailQuery,
    mails,
    numberOfUnreadMails,
  };
}
