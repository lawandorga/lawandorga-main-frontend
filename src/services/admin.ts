import { Group, HasPermission } from "@/types/core";
import { JsonModel } from "@/types/shared";
import { User } from "@/types/user";
import { axios } from "../main";

class AdminService {
  /*
  // Users
  */
  getUsers(): Promise<User[]> {
    return axios.get<User[]>("profiles/").then((response) => response.data);
  }

  updateUser(user: JsonModel): Promise<User> {
    return axios
      .patch<User>(`profiles/${user.id}/`, user)
      .then((response) => response.data);
  }

  getUser(id: number | string): Promise<User> {
    return axios.get<User>(`profiles/${id}/`).then((response) => response.data);
  }

  deleteUser(user: User): Promise<void> {
    return axios.delete(`profiles/${user.id}/`).then();
  }

  acceptUser(user: User): Promise<User> {
    return axios
      .post<Promise<User>>(`profiles/${user.id}/accept/`)
      .then((response) => response.data);
  }

  unlockUser(user: User): Promise<User> {
    return axios
      .post<Promise<User>>(`profiles/${user.id}/unlock/`)
      .then((response) => response.data);
  }

  getUserPermissions(user: User): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>(`profiles/${user.id}/permissions/`)
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

  getMembers(group: Group): Promise<User[]> {
    return axios
      .get(`groups/${group.id}/members/`)
      .then((response) => response.data);
  }

  getGroupPermissions(group: Group): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>(`groups/${group.id}/permissions/`)
      .then((response) => response.data);
  }

  addMember(data: JsonModel, group: Group): Promise<User> {
    return axios
      .post(`groups/${group.id}/member/`, { member: data.user })
      .then((response) => response.data);
  }

  removeMember(data: JsonModel, group: Group): Promise<void> {
    return axios.post(`groups/${group.id}/remove/`, { member: data.id }).then();
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
  createHasPermission(data: JsonModel): Promise<HasPermission> {
    return axios
      .post("has_permission/", data)
      .then((response) => response.data);
  }

  deleteHasPermission(data: JsonModel): Promise<void> {
    return axios.delete(`has_permission/${data.id}/`).then();
  }
}

export default new AdminService();
