import { Group, HasPermission } from "@/types/core";
import { JsonModel } from "@/types/shared";
import { RlcUser, RlcUserSmall, User } from "@/types/user";
import axios from "axios";

class AdminService {
  /*
  // Users
  */
  getUsers(): Promise<RlcUserSmall[]> {
    return axios.get("/rlc_users/").then((response) => response.data);
  }

  updateUser(user: JsonModel): Promise<RlcUser> {
    return axios
      .put<RlcUser>(`/rlc_users/${user.id}/update_information/`, user)
      .then((response) => response.data);
  }

  activateUser(user: JsonModel): Promise<RlcUser> {
    return axios
      .put<RlcUser>(`/rlc_users/${user.id}/activate/`, user)
      .then((response) => response.data);
  }

  getUser(id: number | string): Promise<RlcUser> {
    return axios
      .get<RlcUser>(`rlc_users/${id}/`)
      .then((response) => response.data);
  }

  deleteUser(user: User): Promise<void> {
    return axios.delete(`profiles/${user.id}/`).then();
  }

  acceptUser(data: { user: number }): Promise<void> {
    return axios.post(`org/accept_member/`, data).then((r) => r.data);
  }

  unlockUser(user: User): Promise<void> {
    return axios
      .post<Promise<void>>(`rlc_users/${user.id}/unlock_user/`)
      .then();
  }

  changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<RlcUser> {
    return axios
      .post<Promise<RlcUser>>("profiles/change_password/", data)
      .then((response) => response.data);
  }

  getMembers(group: Group): Promise<RlcUser[]> {
    return axios
      .get(`groups/${group.id}/users/`)
      .then((response) => response.data);
  }

  /*
  // Groups
  */
  getGroups(): Promise<Group[]> {
    return axios.get<Group[]>("groups/").then((response) => response.data);
  }

  getGroup(id: number | string): Promise<Group> {
    return axios.get<Group>(`groups/${id}/`).then((response) => response.data);
  }

  createGroup(group: Group): Promise<Group> {
    return axios
      .post<Group>("groups/", group)
      .then((response) => response.data);
  }

  updateGroup(group: Group): Promise<Group> {
    return axios
      .patch<Group>(`groups/${group.id}/`, group)
      .then((response) => response.data);
  }

  deleteGroup(group: Group): Promise<void> {
    return axios
      .delete(`groups/${group.id}/`)
      .then((response) => response.data);
  }

  /*
  // Permission
  */
  getPermissions(): Promise<
    {
      id: number;
      name: string;
      description: string;
      recommended_for: string;
    }[]
  > {
    return axios.get("permissions/").then((response) => response.data);
  }

  /*
  // HasPermission
  */
  getGroupPermissions(group: Group): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>(`has_permissions/?group=${group.id}`)
      .then((response) => response.data);
  }

  getUserPermissions(user: RlcUser): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>(`has_permissions/?user=${user.user_id}`)
      .then((response) => response.data);
  }

  createHasPermission(data: JsonModel): Promise<HasPermission> {
    return axios
      .post("has_permissions/", data)
      .then((response) => response.data);
  }

  deleteHasPermission(data: JsonModel): Promise<void> {
    return axios.delete(`has_permissions/${data.id}/`).then();
  }
}

export default new AdminService();
