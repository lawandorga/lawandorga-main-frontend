import { CollabDocument, CollabText } from "@/types/collab";
import axios from "../api";

class CollabService {
  getDocuments(): Promise<CollabDocument[]> {
    return axios
      .get<CollabDocument[]>("collab/collab_documents/")
      .then((response) => response.data);
  }

  createDocument(data: {
    name: string;
    path: string;
  }): Promise<CollabDocument> {
    return axios
      .post<CollabDocument>("collab/collab_documents/", data)
      .then((response) => response.data);
  }

  createText(data: { content: string; document: number }): Promise<CollabText> {
    console.log("create");
    return axios
      .post<CollabText>(
        `collab/collab_documents/${data.document}/create_version/`,
        data,
      )
      .then((response) => response.data);
  }

  getLatestText(id: number): Promise<CollabText> {
    return axios
      .get<CollabText>(`collab/collab_documents/${id}/latest/`)
      .then((response) => response.data)
      .catch(() => this.createText({ content: "", document: id }));
  }
}

const Collab = new CollabService();

export default Collab;
