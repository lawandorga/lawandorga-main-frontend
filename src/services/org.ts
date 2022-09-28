import { useUserStore } from "@/store/user";
import { Link } from "@/types/org";
import { types } from "@lawandorga/components";
import axios from "axios";

class OrgService {
  getLinks(): Promise<Link[]> {
    return axios.get<Link[]>("org/links/").then((r) => r.data);
  }

  createLink(data: types.JsonModel): Promise<Link> {
    return axios.post("org/links/", data).then((r) => {
      const store = useUserStore();
      store.updateData();
      return r.data;
    });
  }

  deleteLink(data: types.JsonModel): Promise<void> {
    return axios.post(`org/links/${data.id}/`).then(() => {
      const store = useUserStore();
      store.updateData();
      return;
    });
  }
}

export default new OrgService();
