import { Group } from "@/types/core";
import axios from "../api";

class CoreService {
  getGroups(): Promise<Group[]> {
    return axios.get<Group[]>("groups/").then((response) => response.data);
  }
}

const Core = new CoreService();

export default Core;
