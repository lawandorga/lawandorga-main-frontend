import { Article, ImprintPage, LoginPage, TomsPage } from "@/types/internal";
import axios from "axios";

class InternalService {
  getArticle(id: number | string): Promise<Article> {
    return axios
      .get<Article>(`internal/pages/article/${id}/`)
      .then((response) => response.data);
  }

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

  getTomsPage(): Promise<TomsPage> {
    return axios
      .get<ImprintPage>("internal/pages/toms/")
      .then((response) => response.data);
  }
}

export default new InternalService();
