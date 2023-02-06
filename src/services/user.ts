import { Rlc } from "@/types/core";
import { Key } from "@/types/key";
import {
  DashboardNote,
  DataResponse,
  IRegisterPage,
  RlcUser,
  Settings,
} from "@/types/user";
import { JsonModel } from "@lawandorga/components/dist/types/types";
import axios from "axios";

export function usersGetRegisterPage(): Promise<IRegisterPage> {
  return axios.get("auth/query/page/register/").then((r) => r.data);
}

export function usersRegisterUser(data: {
  email: string;
  name: string;
  org: number;
  password: string;
  password_confirm: string;
}): Promise<void> {
  return axios.post("rlc_users/", data).then();
}

class UserService {
  getRlcs(): Promise<Rlc[]> {
    return axios.get<Rlc[]>("rlcs/").then((response) => response.data);
  }

  logout(): Promise<void> {
    return axios.post("logout/").then();
  }

  data(): Promise<DataResponse> {
    return axios
      .get<DataResponse>(`rlc_users/data_self/`)
      .then((response) => response.data);
  }

  updateSettings(data: Settings): Promise<void> {
    return axios.put("rlc_users/settings_self/", data).then();
  }

  unlockSelf(): Promise<RlcUser> {
    return axios.post("rlc_users/unlock_self/", {}).then((r) => r.data);
  }

  // grant
  grantPermission(data: JsonModel, user: RlcUser): Promise<void> {
    return axios
      .post(`rlc_users/${user.id}/grant_permission/`, data)
      .then((r) => r.data);
  }

  // notes
  getNotes(): Promise<DashboardNote[]> {
    return axios.get("notes/").then((response) => response.data);
  }

  createNote(note: DashboardNote): Promise<DashboardNote> {
    return axios
      .post<DashboardNote>("notes/", note)
      .then((response) => response.data);
  }

  updateNote(note: DashboardNote): Promise<DashboardNote> {
    return axios
      .patch<DashboardNote>(`notes/${note.id}/`, note)
      .then((response) => response.data);
  }

  deleteNote(note: DashboardNote): Promise<void> {
    return axios.delete(`notes/${note.id}/`);
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
