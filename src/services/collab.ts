import {
  CollabDocument,
  CollabDocumentPermission,
  CollabPermission,
  CollabVersion,
} from "@/types/collab";
import { HasPermission } from "@/types/core";
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

  deleteDocument(data: CollabDocument): Promise<CollabDocument> {
    return axios
      .delete<CollabDocument>(`collab/collab_documents/${data.id}`)
      .then((response) => response.data);
  }

  createVersion(data: {
    content: string;
    document: number;
  }): Promise<CollabVersion> {
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

  getGeneralPermissions(): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>("has_permission/collab/")
      .then((response) => response.data);
  }

  getCollabPermissions(): Promise<CollabPermission[]> {
    return axios
      .get<CollabPermission[]>("collab/collab_permissions")
      .then((response) => response.data);
  }

  getDocumentPermissions(id: number): Promise<CollabDocumentPermission[]> {
    return axios
      .get<CollabDocumentPermission[]>(
        `collab/collab_documents/${id}/permissions/`,
      )
      .then((response) => response.data);
  }

  createDocumentPermission(data: {
    permission: number;
    document: number;
    group: number;
  }): Promise<CollabDocumentPermission> {
    return axios
      .post<CollabDocumentPermission>("collab/document_permissions/", data)
      .then((response) => response.data);
  }

  deleteDocumentPermission(id: number): Promise<void> {
    return axios.delete(`collab/document_permissions/${id}/`);
  }
}

const Collab = new CollabService();

export default Collab;
