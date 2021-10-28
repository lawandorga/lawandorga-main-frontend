import { CollabDocument, CollabText } from "@/types/collab";
import { DjangoModel } from "@/types/shared";
import axios from "../api";

class CollabService {
  getDocuments(): Promise<CollabDocument[]> {
    return axios
      .get<CollabDocument[]>("collab/collab_documents/")
      .then((response) => response.data);
  }

  createDocument(data: DjangoModel): Promise<CollabDocument> {
    return axios
      .post<CollabDocument>("collab/collab_documents/", data)
      .then((response) => response.data);
  }

  getLatestText(id: number) {
    return axios
      .get<CollabText>(`collab/collab_documents/${id}/latest/`)
      .then((response) => response.data)
      .catch(() => {
        // create a new text
        console.log("create a new text");
      });
  }
}

const Collab = new CollabService();
export default Collab;
