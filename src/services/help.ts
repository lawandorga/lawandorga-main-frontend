import { HelpPage } from "@/types/page";
import axios from "axios";

class HelpService {
  getHelpPage(): Promise<HelpPage> {
    return axios.get("internal/pages/help/").then((response) => response.data);
  }
}

export default new HelpService();
