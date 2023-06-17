import { Rlc } from "@/types/core";
import { Key } from "@/types/key";
import { DashboardNote, IRegisterPage, Settings } from "@/types/user";
import axios from "axios";

export function usersGetRegisterPage(): Promise<IRegisterPage> {
  return axios.get("auth/query/page/register/").then((r) => r.data);
}

class UserService {
  getRlcs(): Promise<Rlc[]> {
    return axios.get<Rlc[]>("rlcs/").then((response) => response.data);
  }

  updateSettings(data: Settings): Promise<void> {
    return axios.put("rlc_users/settings_self/", data).then();
  }

  // notes
  getNotes(): Promise<DashboardNote[]> {
    return axios.get("query/notes/").then((response) => response.data);
  }

  // keys
  getKeys(): Promise<Key[]> {
    return axios.get("keys/").then((response) => response.data);
  }

  deleteKey(key: Key): Promise<void> {
    return axios.delete(`keys/${key.id}/`).then();
  }

  testKeys(): Promise<Key[]> {
    return axios.post("keys/test/", {}).then((response) => response.data);
  }
}

export default new UserService();
