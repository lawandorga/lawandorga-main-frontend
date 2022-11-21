import { IFolderItem } from "@/types/folders";
import axios from "axios";

export function foldersCreateFolder(data: { name: string }): Promise<void> {
  return axios.post("folders/", data).then();
}

export function foldersDeleteFolder(data: { id: string }): Promise<void> {
  return axios.delete(`folders/${data.id}/`).then();
}

export function foldersListFolders(): Promise<IFolderItem[]> {
  return axios.get("folders/").then((r) => r.data);
}

export function foldersUpdateFolder(data: {
  name: string;
  id: string;
}): Promise<void> {
  return axios.post(`folders/${data.id}/`, data).then();
}
