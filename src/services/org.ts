import { useUserStore } from "@/store/user";
import { ILink } from "@/types/org";
import { types } from "@lawandorga/components";
import axios from "axios";

class OrgService {
  getLinks(): Promise<ILink[]> {
    return axios.get<ILink[]>("org/links/").then((r) => r.data);
  }

  createLink(data: types.JsonModel): Promise<ILink> {
    return axios.post("org/links/", data).then((r) => {
      const store = useUserStore();
      store.updateData();
      return r.data;
    });
  }

  deleteLink(data: types.JsonModel): Promise<void> {
    return axios.delete(`org/links/${data.id}/`).then(() => {
      const store = useUserStore();
      store.updateData();
    });
  }
}

export default new OrgService();
