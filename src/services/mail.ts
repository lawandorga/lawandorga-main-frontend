import { MailPageMail } from "@/types/mail";
import axios from "axios";

export function mailGetPageMail(): Promise<MailPageMail | false> {
  return axios
    .get("mail/query/page/mail/")
    .then((response) => response.data)
    .catch((error) => {
      if (error.response.status === 444) return false;
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
