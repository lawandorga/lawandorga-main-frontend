import { Tag } from "@/types/records";
import axios from "../api";

class UserService {
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
      .patch<Tag>(`api/records/tags/${tag.id}/`, tag)
      .then((response) => response.data);
  }

  deleteTag(id: number): Promise<void> {
    return axios.delete(`records/tags/${id}/`);
  }
}

export default new UserService();
