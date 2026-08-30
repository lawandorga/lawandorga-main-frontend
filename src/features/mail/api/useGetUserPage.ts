import { computed, ref } from "vue";

import useGet2 from "@/composables/useGet2";

export interface MailDomain {
  uuid: string;
  name: string;
  is_active: boolean;
}

export interface MailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: MailDomain;
}

export interface MailUserPage {
  available_domains: MailDomain[];
  addresses: MailAddress[];
}

export function useGetUserPage(uuid: string) {
  const page = ref<MailUserPage>();
  const query = useGet2(`api/mail/query/page/user/${uuid}/`, page);

  const addresses = computed<MailAddress[] | null>(() => {
    if (!page.value) return null;
    return page.value.addresses;
  });

  return {
    page,
    query,
    addresses,
  };
}
