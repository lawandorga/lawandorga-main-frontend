import { Group } from "@/types/core";
import axios from "axios";

class CoreService {
  getGroups(): Promise<Group[]> {
    return axios
      .get<Group[]>("query/groups/")
      .then((response) => response.data);
  }
}

const Core = new CoreService();

export default Core;
