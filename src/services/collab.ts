import {
  CollabDocument,
  CollabDocumentPermission,
  CollabPermission,
  CollabVersion,
} from "@/types/collab";
import { HasPermission } from "@/types/core";
import { JsonModel } from "@/types/shared";
import { axios } from "../main";

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

  deleteDocument(data: CollabDocument): Promise<void> {
    return axios
      .delete<void>(`collab/collab_documents/${data.id}/`)
      .then((response) => response.data);
  }

  createVersion(data: JsonModel): Promise<CollabDocument> {
    return axios
      .patch<CollabDocument>(`collab/collab_documents/${data.document}/`, data)
      .then((response) => response.data);
  }

  getLatestVersion(id: number): Promise<CollabDocument> {
    return axios
      .get<CollabDocument>(`collab/collab_documents/${id}/`)
      .then((response) => response.data);
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
      .get<CollabPermission[]>("collab/collab_permissions/")
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

  deleteDocumentPermission(document: CollabDocument): Promise<void> {
    return axios.delete(`collab/document_permissions/${document.id}/`);
  }
}

export default new CollabService();
