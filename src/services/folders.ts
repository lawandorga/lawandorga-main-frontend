import { IAvailableFolder, IFolderPage } from "@/types/folders";
import axios from "axios";

// query
export function foldersGetFolderPage(): Promise<IFolderPage> {
  return axios.get("folders/query/").then((r) => r.data);
}

export function foldersGetAvailableFolders(): Promise<IAvailableFolder[]> {
  return axios.get("folders/query/available_folders/").then((r) => r.data);
}

// commands
export function foldersCreateFolder(data: { name: string }): Promise<void> {
  return axios.post("folders/folders/", data).then();
}

export function foldersDeleteFolder(data: { id: string }): Promise<void> {
  return axios.delete(`folders/folders/${data.id}/`).then();
}

export function foldersGrantAccess(data: {
  id: string;
  user_slug: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.id}/grant_access/`, data).then();
}

export function foldersRevokeAccess(data: {
  id: string;
  user_slug: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.id}/revoke_access/`, data).then();
}

export function foldersUpdateFolder(data: {
  name: string;
  id: string;
}): Promise<void> {
  return axios.post(`folders/folders/${data.id}/`, data).then();
}
