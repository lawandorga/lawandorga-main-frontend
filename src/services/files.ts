import {
  FilesFolder,
  FilesPermission,
  FilesFile,
  FilesPossiblePermission,
} from "@/types/files";
import { JsonModel } from "@/types/shared";
import downloadFile from "@/utils/download";
import axios from "../api";

class FilesService {
  // permissions
  getPermissions(folder: FilesFolder): Promise<FilesPermission[]> {
    return axios
      .get<FilesPermission[]>(`files/folder/${folder.id}/permissions/`)
      .then((response) => response.data);
  }

  createPermission(permission: FilesPermission): Promise<FilesPermission> {
    return axios
      .post<FilesPermission>("files/permission_for_folder/", permission)
      .then((response) => response.data);
  }

  deletePermission(permission: FilesPermission): Promise<void> {
    return axios
      .delete<void>(`files/permission_for_folder/${permission.id}/`)
      .then();
  }

  // possible permissions
  getPossiblePermissions(): Promise<FilesPossiblePermission[]> {
    return axios
      .get<FilesPossiblePermission[]>(`files/folder_permission/`)
      .then((response) => response.data);
  }

  // items
  getItems(folder: FilesFolder): Promise<(FilesFolder | FilesFile)[]> {
    return axios
      .get<(FilesFolder | FilesFile)[]>(`files/folder/${folder.id}/items/`)
      .then((response) => response.data);
  }

  // folder
  createFolder(folder: FilesFolder): Promise<FilesFolder> {
    return axios
      .post<FilesFolder>("files/folder/", folder)
      .then((response) => response.data);
  }

  updateFolder(folder: FilesFolder): Promise<FilesFolder> {
    return axios
      .patch<FilesFolder>(`files/folder/${folder.id}/`, folder)
      .then((response) => response.data);
  }

  deleteFolder(folder: FilesFolder): Promise<void> {
    return axios
      .delete<void>(`files/folder/${folder.id}/`)
      .then((response) => response.data);
  }

  getFolder(id: number | string): Promise<FilesFolder> {
    return axios
      .get<FilesFolder>(`files/folder/${id}/`)
      .then((response) => response.data);
  }

  getFirstFolder(): Promise<FilesFolder> {
    return axios
      .get<FilesFolder>("files/folder/first/")
      .then((response) => response.data);
  }

  // files
  createFile(data: JsonModel): Promise<FilesFile> {
    return axios
      .post<FilesFile>("files/file_base/", data)
      .then((response) => response.data);
  }

  deleteFile(file: FilesFile): Promise<void> {
    return axios.delete<void>(`files/file_base/${file.id}/`).then();
  }

  downloadFile(file: FilesFile): void {
    axios
      .get<Blob>(`files/file_base/${file.id}/`, {
        responseType: "blob",
      })
      .then((response) => downloadFile(response, file.name));
  }
}

export default new FilesService();