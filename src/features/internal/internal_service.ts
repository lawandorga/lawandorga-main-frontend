import { ImprintPage, LoginPage } from "@/types/internal";
import axios from "axios";

class InternalService {
  getLoginPage(): Promise<LoginPage> {
    return axios
      .get<LoginPage>("internal/pages/index/")
      .then((response) => response.data);
  }

  getImprintPage(): Promise<ImprintPage> {
    return axios
      .get<ImprintPage>("internal/pages/imprint/")
      .then((response) => response.data);
  }
}

export default new InternalService();
