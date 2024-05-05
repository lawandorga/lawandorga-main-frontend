import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, ref } from "vue";

export interface MailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: MailDomain;
}

export interface MailDomain {
  uuid: string;
  name: string;
  is_active: boolean;
}

export interface MailGroupPage {
  available_domains: MailDomain[];
  addresses: MailAddress[];
  members: MailUser[];
  available_users: MailUser[];
}

export interface MailUser {
  name: string;
  uuid: string;
  email: string | null;
}

export function useGetGroupPage(uuid: string) {
  const client = useClient();

  const request = client.get(`api/mail/query/page/group/${uuid}/`);

  const page = ref<MailGroupPage>();
  const query = useGet(request, page);

  // available domains
  const availableDomains = computed<MailDomain[]>(() => {
    if (!page.value) return [];
    return page.value.available_domains;
  });

  // members
  const members = computed<MailUser[] | null>(() => {
    if (!page.value) return null;
    return page.value.members;
  });

  // addresses
  const addresses = computed<MailAddress[] | null>(() => {
    if (!page.value) return null;
    return page.value.addresses;
  });

  return {
    page,
    query,
    availableDomains,
    members,
    addresses,
  };
}
