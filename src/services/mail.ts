import {
  IMailCheckDomain,
  IMailGroupPage,
  MailDashboardPage,
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
    });
}

export function mailGetGroupPage(uuid: string): Promise<IMailGroupPage> {
  return axios.get(`mail/query/page/group/${uuid}/`).then((r) => r.data);
}

export function mailCheckDomain(data: {
  uuid: string;
}): Promise<IMailCheckDomain> {
  return axios
    .post(`mail/domains/${data.uuid}/check_domain/`)
    .then((r) => r.data);
}

export function mailGetUserPage(uuid: string): Promise<IMailGroupPage> {
  return axios.get(`mail/query/page/user/${uuid}/`).then((r) => r.data);
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

export function mailDeleteAddress(data: {
  user: string;
  address: string;
}): Promise<void> {
  return axios
    .delete(`mail/users/${data.user}/delete_address/${data.address}/`)
    .then();
}

export function mailSetDefaultAddress(data: {
  user: string;
  address: string;
}): Promise<void> {
  return axios
    .post(`mail/users/${data.user}/set_default_address/${data.address}/`, data)
    .then();
}

export function mailRegeneratePassword(): Promise<{ password: string }> {
  return axios.post(`mail/users/regenerate_password/`).then((r) => r.data);
}

export function mailAddDomain(data: { name: string }): Promise<void> {
  return axios.post(`mail/domains/`, data).then();
}

export function mailChangeDomain(data: {
  uuid: string;
  name: string;
}): Promise<void> {
  return axios.post(`mail/domains/${data.uuid}/`, data).then();
}

export function mailCreateGroup(data: {
  localpart: string;
  domain: string;
}): Promise<void> {
  return axios.post("mail/groups/", data).then();
}

export function mailDeleteGroup(data: { group: string }): Promise<void> {
  return axios.delete(`mail/groups/${data.group}/`).then();
}

export function mailGroupAddAddress(data: {
  group: string;
  localpart: string;
  domain: string;
}): Promise<void> {
  return axios.post(`mail/groups/${data.group}/add_address/`, data).then();
}

export function mailGroupSetDefaultAddress(data: {
  group: string;
  address: string;
}): Promise<void> {
  return axios
    .post(`mail/groups/${data.group}/set_default_address/`, data)
    .then();
}

export function mailGroupDeleteAddress(data: {
  group: string;
  address: string;
}): Promise<void> {
  return axios.post(`mail/groups/${data.group}/delete_address/`, data).then();
}

export function mailGroupAddMember(data: { group: string; member: string }) {
  return axios.post(`mail/groups/${data.group}/add_member/`, data).then();
}

export function mailGroupRemoveMember(data: { group: string; member: string }) {
  return axios.post(`mail/groups/${data.group}/remove_member/`, data).then();
}
