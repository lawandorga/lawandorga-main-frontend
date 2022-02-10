import { axios } from "../main";

class HelpService {
  /*
  // Permission
  */
  getPermissions() {
    return axios.get("permissions/").then((response) => response.data);
  }
}

export default new HelpService();
