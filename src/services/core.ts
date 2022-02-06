import { Group } from "@/types/core";
import { axios } from "../main";

class CoreService {
  getGroups(): Promise<Group[]> {
    return axios.get<Group[]>("groups/").then((response) => response.data);
  }

  // getPermissions(): Promise<Permission[]> {
  //   return axios.get<Permission[]>('permission')
  // }
}

const Core = new CoreService();

export default Core;
