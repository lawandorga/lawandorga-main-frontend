import { IAvailableFolder, IFolderDetail, IFolderPage } from "@/types/folders";
import axios from "axios";

// query
export function foldersGetFolderPage(): Promise<IFolderPage> {
  return axios.get("folders/query/").then((r) => r.data);
}

export function foldersGetFolderDetail(uuid: string): Promise<IFolderDetail> {
  return axios.get(`folders/query/${uuid}/`).then((r) => r.data);
}

export function foldersGetAvailableFolders(): Promise<IAvailableFolder[]> {
  return axios.get("folders/query/available_folders/").then((r) => r.data);
}

// commands
export function foldersCreateFolder(data: { name: string }): Promise<void> {
  return axios.post("folders/folders/", data).then();
}

export function foldersDeleteFolder(data: { uuid: string }): Promise<void> {
  return axios.delete(`folders/folders/${data.uuid}/`).then();
}

export function foldersGrantAccess(data: {
  uuid: string;
  user_uuid: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.uuid}/grant_access/`, data).then();
}

export function foldersToggleInheritance(data: {
  folder: string;
}): Promise<void> {
  return axios
    .post(`folders/folders/${data.folder}/toggle_inheritance/`)
    .then();
}

export function foldersMoveFolder(data: {
  folder: string;
  target: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.folder}/move/`, data).then();
}

export function foldersRevokeAccess(data: {
  user_uuid: string;
  url: string;
}): Promise<void> {
  return axios.post(data.url, data).then();
}

export function foldersUpdateFolder(data: {
  name: string;
  uuid: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.uuid}/`, data).then();
}

export function foldersOptimize(): Promise<void> {
  return axios.post("folders/folders/optimize/").then();
}
