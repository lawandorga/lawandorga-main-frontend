import { Group, HasPermission } from "@/types/core";
import { Tag } from "@/types/records";
import { JsonModel } from "@/types/shared";
import { User } from "@/types/user";
import axios from "../api";

class AdminService {
  /*
  // Tags
  */
  getTags(): Promise<Tag[]> {
    return axios.get<Tag[]>(`records/tags/`).then((response) => response.data);
  }

  createTag(tag: Tag): Promise<Tag> {
    return axios
      .post<Tag>("records/tags/", tag)
      .then((response) => response.data);
  }

  updateTag(tag: Tag): Promise<Tag> {
    return axios
      .patch<Tag>(`records/tags/${tag.id}/`, tag)
      .then((response) => response.data);
  }

  deleteTag(tag: Tag): Promise<void> {
    return axios.delete(`records/tags/${tag.id}/`);
  }

  /*
  // Users
  */
  getUsers(): Promise<User[]> {
    return axios.get<User[]>("profiles/").then((response) => response.data);
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
