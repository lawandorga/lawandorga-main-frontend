import { IFolderTree } from "@/types/folders";
import axios from "axios";

export function createFolder(data: { name: string }): Promise<void> {
  return axios.post("folders/", data).then();
}

export function deleteFolder(data: { id: string }): Promise<void> {
  return axios.delete(`folders/${data.id}/`).then();
}

export function listFolders(): Promise<IFolderTree> {
  return axios.get("folders/").then((r) => r.data);
}
