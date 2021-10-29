import { CollabDocument, CollabVersion } from "@/types/collab";
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

  createVersion(data: {
    content: string;
    document: number;
  }): Promise<CollabVersion> {
    console.log("create");
    return axios
      .post<CollabVersion>(
        `collab/collab_documents/${data.document}/create_version/`,
        data,
      )
      .then((response) => response.data);
  }

  getLatestVersion(id: number): Promise<CollabVersion> {
    return axios
      .get<CollabVersion>(`collab/collab_documents/${id}/latest/`)
      .then((response) => response.data)
      .catch(() => this.createVersion({ content: "", document: id }));
  }

  getVersions(id: number): Promise<CollabVersion[]> {
    return axios
      .get<CollabVersion[]>(`collab/collab_documents/${id}/versions/`)
      .then((response) =>
        response.data.sort((item1, item2) => item2.id - item1.id),
      );
  }
}

const Collab = new CollabService();

export default Collab;
