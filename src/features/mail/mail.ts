import axios from "axios";

export function mailRegeneratePassword(): Promise<{ password: string }> {
  return axios.post(`mail/users/regenerate_password/`).then((r) => r.data);
}
