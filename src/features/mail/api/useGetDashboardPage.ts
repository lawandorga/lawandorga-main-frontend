import useGet from "@/composables/useGet";
import { ref, computed } from "vue";
import axios from "axios";

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

  const request = () =>
    axios
      .get("mail/query/page/dashboard/")
      .then((response) => {
        const data = response.data;
        data["noMailAccount"] = false;
        return data;
      })
      .catch((error) => {
        if (error.response.status === 444) return { noMailAccount: true };
        throw error;
      });

  const query = useGet(request, page);

  const user = computed<SelfMailUser | null | false>(() => {
    if (page.value == undefined) return null;
    else if (page.value.noMailAccount) return false;
    return page.value.user;
  });

  const addresses = computed<MailAddress[] | null>(() => {
    if (user.value === null || user.value === false) return null;
    return user.value.account.addresses;
  });

  return {
    query,
    page,
    user,
    addresses,
  };
}
