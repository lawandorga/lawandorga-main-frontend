import { MailDashboardPage, NoMailAccount } from "@/types/mail";
import axios from "axios";

export function mailGetDashboardPage(): Promise<
  MailDashboardPage | NoMailAccount
> {
  return axios
    .get("mail/query/page/mail/")
    .then((response) => {
      const data = response.data;
      data["noMailAccount"] = false;
      return data;
    })
    .catch((error) => {
      if (error.response.status === 444) return { noMailAccount: true };
    });
}

export function mailCreateUser(): Promise<void> {
  return axios.post("mail/users/").then();
}

export function mailAddAddress(data: {
  user: string;
  localpart: string;
  domain: string;
}): Promise<void> {
  return axios.post(`mail/users/${data.user}/add_address/`, data).then();
}

export function mailDeleteAddress(data: { id: string }): Promise<void> {
  return axios.delete(`mail/users/delete_address/${data.id}/`).then();
}

export function mailSetDefaultAddress(data: { id: string }): Promise<void> {
  return axios.post(`mail/users/set_default_address/${data.id}/`, data).then();
}

export function mailRegeneratePassword(): Promise<{ password: string }> {
  return axios.post(`mail/users/regenerate_password/`).then((r) => r.data);
}

export function mailAddDomain(data: { domain: string }): Promise<void> {
  return axios.post(`mail/domains/`, data).then();
}
