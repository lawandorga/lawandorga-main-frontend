import { Group } from "@/types/core";
import { Tag } from "@/types/records";
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
  // Groups
  */
  getGroups(): Promise<Group[]> {
    return axios.get<Group[]>("groups/").then((response) => response.data);
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
}

export default new AdminService();
