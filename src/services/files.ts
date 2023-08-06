import {
  FilesFolder,
  FilesPermission,
  FilesFile,
  FilesPossiblePermission,
} from "@/types/files";
import { downloadFileRequest } from "@/utils/download";
import { types } from "lorga-ui";
import axios from "axios";

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
  getFolders(): Promise<FilesFolder[]> {
    return axios
      .get<FilesFolder[]>("files/folder/")
      .then((response) => response.data);
  }

  foldersCreateFolder(folder: FilesFolder): Promise<FilesFolder> {
    return axios
      .post<FilesFolder>("files/folder/", folder)
      .then((response) => response.data);
  }

  updateFolder(folder: FilesFolder): Promise<FilesFolder> {
    return axios
      .patch<FilesFolder>(`files/folder/${folder.id}/`, folder)
      .then((response) => response.data);
  }

  foldersDeleteFolder(folder: FilesFolder): Promise<void> {
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
  createFile(data: Record<string, any>): Promise<FilesFile> {
    const formData = new FormData();
    if (data.folder) formData.append("folder", data.folder);
    if (data.file) formData.append("file", data.file);

    return axios
      .post<FilesFile>("files/file_base/", formData)
      .then((response) => response.data);
  }

  updateFile(file: FilesFile): Promise<FilesFile> {
    return axios
      .patch<FilesFile>(`files/file_base/${file.id}/`, file)
      .then((response) => response.data);
  }

  deleteFile(file: FilesFile): Promise<void> {
    return axios.delete<void>(`files/file_base/${file.id}/`).then();
  }

  downloadFile(file: FilesFile): void {
    downloadFileRequest(axios, `files/file_base/${file.id}/`, file.name);
  }
}

export default new FilesService();
