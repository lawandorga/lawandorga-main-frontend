import { Rlc } from "@/types/core";
import {
  DashboardInformation,
  DashboardNote,
  LoginResponse,
  RefreshResponse,
  User,
} from "@/types/user";
import axios from "axios";

interface StaticsResponse {
  user: User;
  rlc: Rlc;
  permissions: string[];
}

interface AdminInformation {
  profiles: number;
  record_deletion_requests: number;
  record_permit_requests: number;
}

class UserService {
  getRlcs(): Promise<Rlc[]> {
    return axios.get<Rlc[]>("rlcs/").then((response) => response.data);
  }

  login(data: { email: string; password: string }): Promise<LoginResponse> {
    return axios
      .post<LoginResponse>(`profiles/login/`, data)
      .then((response) => response.data);
  }

  refresh(data: { refresh: string }): Promise<RefreshResponse> {
    return axios
      .post<RefreshResponse>(`profiles/refresh/`, data)
      .then((response) => response.data);
  }

  statics(): Promise<StaticsResponse> {
    return axios
      .get<StaticsResponse>(`profiles/statics/`)
      .then((response) => response.data);
  }

  admin(): Promise<AdminInformation> {
    return axios
      .get<AdminInformation>("profiles/admin/")
      .then((response) => response.data);
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

  // getPermissions(): Promise<Permission[]> {
  //   return axios.get<Permission[]>('permission')
  // }
}

export default new UserService();
