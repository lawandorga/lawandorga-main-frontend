import { ref, computed } from "vue";

import useGet2 from "@/composables/useGet2";

export interface AvailableMailDomain {
  uuid: string;
  name: string;
}

export interface MailDomain {
  uuid: string;
  name: string;
  is_active: boolean;
}

export interface MailGroup {
  uuid: string;
  email: string | null;
}

export interface MailUser {
  name: string;
  uuid: string;
  email: string | null;
}

export interface MailAddress {
  uuid: string;
  is_default: boolean;
  localpart: string;
  domain: MailDomain;
}

interface SelfMailAccount {
  addresses: MailAddress[];
}

interface SelfGroup {
  email: string | null;
}

export interface SelfMailUser {
  email: string | null;
  uuid: string | null;
  account: SelfMailAccount;
  aliases: string[];
  groups: SelfGroup[];
}

export interface NoMailAccount {
  noMailAccount: true;
}

export interface MailDashboardPage {
  user: SelfMailUser;
  available_domains: AvailableMailDomain[];
  domain: MailDomain;
  noMailAccount: false;
  users: MailUser[];
  groups: MailGroup[];
}

export function useGetDashboardPage() {
  const page = ref<MailDashboardPage | NoMailAccount>();

  const query = useGet2("mail/query/page/dashboard/", page);

  const user = computed<SelfMailUser | null | false>(() => {
    if (page.value == undefined) return null;
    else if (page.value.noMailAccount) return false;
    return page.value.user;
  });

  const addresses = computed<MailAddress[] | null>(() => {
    if (user.value === null || user.value === false) return null;
    return user.value.account.addresses;
  });

  const domain = computed<MailDomain | null>(() => {
    if (page.value && !page.value.noMailAccount) return page.value.domain;
    return null;
  });

  const users = computed<MailUser[] | null>(() => {
    if (page.value && !page.value.noMailAccount) return page.value.users;
    return null;
  });

  return {
    query,
    page,
    domain,
    users,
    user,
    addresses,
  };
}
