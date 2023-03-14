import { IArticle, ImprintPage, ILoginPage, TomsPage } from "@/types/internal";
import axios from "axios";

class InternalService {
  getArticles(): Promise<IArticle[]> {
    return axios.get<IArticle[]>("articles/").then((response) => response.data);
  }

  getArticle(id: number | string): Promise<IArticle> {
    return axios
      .get<IArticle>(`articles/${id}/`)
      .then((response) => response.data);
  }

  getLoginPage(): Promise<ILoginPage> {
    return axios
      .get<ILoginPage>("internal/pages/index/")
      .then((response) => response.data);
  }

  getImprintPage(): Promise<ImprintPage> {
    return axios
      .get<ImprintPage>("internal/pages/imprint/")
      .then((response) => response.data);
  }

  getTomsPage(): Promise<TomsPage> {
    return axios
      .get<ImprintPage>("internal/pages/toms/")
      .then((response) => response.data);
  }
}

export default new InternalService();
