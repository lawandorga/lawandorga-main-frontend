import { Rlc } from "@/types/core";
import { Key } from "@/types/key";
import {
  BadgeInformation,
  DashboardInformation,
  DashboardNote,
  DataResponse,
  RefreshResponse,
  RlcUser,
  Settings,
  User,
} from "@/types/user";
import { JsonModel } from "@lawandorga/components/dist/types/types";
import axios from "axios";

class UserService {
  getRlcs(): Promise<Rlc[]> {
    return axios.get<Rlc[]>("rlcs/").then((response) => response.data);
  }

  login(data: { email: string; password: string }): Promise<void> {
    return axios.post("login/", data).then();
  }

  logout(): Promise<void> {
    return axios.post("logout/").then();
  }

  refresh(data: { refresh: string }): Promise<RefreshResponse> {
    return axios
      .post<RefreshResponse>(`profiles/refresh/`, data)
      .then((response) => response.data);
  }

  data(): Promise<DataResponse> {
    return axios
      .get<DataResponse>(`rlc_users/data_self/`)
      .then((response) => response.data);
  }

  admin(): Promise<BadgeInformation> {
    return axios
      .get<BadgeInformation>("profiles/admin/")
      .then((response) => response.data);
  }

  updateSettings(data: Settings): Promise<void> {
    return axios.put("rlc_users/settings_self/", data).then();
  }

  dashboard(): Promise<DashboardInformation> {
    return axios
      .get<DashboardInformation>("profiles/dashboard/")
      .then((response) => response.data);
  }

  register(data: User): Promise<void> {
    return axios.post("profiles/", data).then();
  }

  requestPasswordReset(data: { email: string }): Promise<void> {
    return axios.post("profiles/password_reset/", data).then();
  }

  confirmEmail(data: { user: string; token: string }): Promise<void> {
    return axios
      .post(`profiles/${data.user}/activate/${data.token}/`, {})
      .then();
  }

  resetPassword(data: {
    user: number;
    new_password: string;
    new_password_confirm: string;
    token: string;
  }): Promise<void> {
    return axios
      .post(`profiles/${data.user}/password_reset_confirm/`, data)
      .then();
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
