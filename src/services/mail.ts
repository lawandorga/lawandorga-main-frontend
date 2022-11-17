import { MailUser } from "@/types/mail";
import axios from "axios";

export function mailGetUser(): Promise<MailUser> {
  return axios.get("mail/users/self/").then((response) => response.data);
}

export function mailCreateUser(): Promise<void> {
  return axios.post("mail/users/").then();
}
