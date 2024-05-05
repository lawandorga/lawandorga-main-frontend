import {
  MailCheckDomain,
  MailDashboardPage,
  MailUserPage,
  NoMailAccount,
} from "@/types/mail";
import axios from "axios";

export function mailGetDashboardPage(): Promise<
  MailDashboardPage | NoMailAccount
> {
  return axios
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
}

export function mailCheckDomain(data: {
  uuid: string;
}): Promise<MailCheckDomain> {
  return axios
    .post(`mail/domains/${data.uuid}/check_domain/`)
    .then((r) => r.data);
}

export function mailGetUserPage(uuid: string): Promise<MailUserPage> {
  return axios.get(`mail/query/page/user/${uuid}/`).then((r) => r.data);
}

export function mailRegeneratePassword(): Promise<{ password: string }> {
  return axios.post(`mail/users/regenerate_password/`).then((r) => r.data);
}
