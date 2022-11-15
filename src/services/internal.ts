import {
  IArticle,
  ImprintPage,
  ILoginPage,
  IRoadmapItem,
  TomsPage,
} from "@/types/internal";
import axios from "axios";

class InternalService {
  getRoadmapItems(): Promise<IRoadmapItem[]> {
    return axios
      .get<IRoadmapItem[]>("roadmap-items/")
      .then((response) => response.data);
  }

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
      .get<ILoginPage>("pages/index/")
      .then((response) => response.data);
  }

  getImprintPage(): Promise<ImprintPage> {
    return axios
      .get<ImprintPage>("pages/imprint/")
      .then((response) => response.data);
  }

  getTomsPage(): Promise<TomsPage> {
    return axios
      .get<ImprintPage>("pages/toms/")
      .then((response) => response.data);
  }
}

export default new InternalService();
