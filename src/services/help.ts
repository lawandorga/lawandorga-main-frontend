import { Permission } from "@/types/core";
import { HelpPage } from "@/types/page";
import axios from "axios";

class HelpService {
  /*
  // Permission
  */
  getPermissions(): Promise<Permission> {
    return axios.get("permissions/").then((response) => response.data);
  }

  getHelpPage(): Promise<HelpPage> {
    return axios.get("internal/pages/help/").then((response) => response.data);
  }
}

export default new HelpService();
