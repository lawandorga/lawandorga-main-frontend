import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, ref } from "vue";

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
  const client = useClient();
  const request = client.get(`api/mail/query/page/user/${uuid}/`);

  const page = ref<MailUserPage>();
  const query = useGet(request, page);

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
