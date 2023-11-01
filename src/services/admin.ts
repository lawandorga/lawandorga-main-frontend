import { RlcUserSmall } from "@/types/user";
import axios from "axios";

class AdminService {
  getUsers(): Promise<RlcUserSmall[]> {
    return axios.get("/rlc_users/").then((response) => response.data);
  }
}

export default new AdminService();
