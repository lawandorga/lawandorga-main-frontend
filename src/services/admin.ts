import { Group, HasPermission } from "@/types/core";
import { JsonModel } from "@/types/shared";
import { RlcUser, User } from "@/types/user";
import axios from "axios";

class AdminService {
  /*
  // Users
  */
  getUsers(): Promise<RlcUser[]> {
    return axios.get<RlcUser[]>("profiles/").then((response) => response.data);
  }

  updateUser(user: JsonModel): Promise<RlcUser> {
    return axios
      .patch<RlcUser>(`profiles/${user.id}/`, user)
      .then((response) => response.data);
  }

  getUser(id: number | string): Promise<RlcUser> {
    return axios
      .get<RlcUser>(`profiles/${id}/`)
      .then((response) => response.data);
  }

  deleteUser(user: User): Promise<void> {
    return axios.delete(`profiles/${user.id}/`).then();
  }

  acceptUser(user: User): Promise<RlcUser> {
    return axios
      .post<Promise<RlcUser>>(`profiles/${user.id}/accept/`)
      .then((response) => response.data);
  }

  unlockUser(user: User): Promise<RlcUser> {
    return axios
      .post<Promise<RlcUser>>(`profiles/${user.id}/unlock/`)
      .then((response) => response.data);
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
      .get(`profiles/?group=${group.id}`)
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

  addMember(data: JsonModel, group: Group): Promise<User> {
    return axios
      .post(`groups/${group.id}/member/`, { member: data.user })
      .then((response) => response.data);
  }

  removeMember(data: RlcUser, group: Group): Promise<void> {
    return axios
      .delete(`groups/${group.id}/member/`, {
        data: { member: data.id },
      })
      .then();
  }

  /*
  // Permission
  */
  getPermissions() {
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
      .get<HasPermission[]>(`has_permissions/?user=${user.user}`)
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
