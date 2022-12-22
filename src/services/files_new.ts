import { RecordsDocument } from "@/types/records";
import { blobToDataURL, downloadFileRequest } from "@/utils/download";
import axios from "axios";

export function filesNewUploadFile(data: {
  name: string;
  folder: string;
  file: File;
}) {
  const formData = new FormData();
  if (data.folder) formData.append("folder", data.folder);
  if (data.file) formData.append("file", data.file);
  if (data.name) formData.append("name", data.name);

  return axios.post(`files/v2/`, formData).then();
}

export function filesDownloadFile(uuid: string): Promise<string> {
  return axios
    .get(`files/v2/query/${uuid}/download/`, {
      responseType: "blob",
    })
    .then((r) => {
      return blobToDataURL(r.data);
    });
}

export function filesRetrieveFile(uuid: string): Promise<RecordsDocument> {
  return axios.get(`files/v2/query/${uuid}/`).then((r) => r.data);
}

export function filesDownloadFileToMachine(file: RecordsDocument): void {
  downloadFileRequest(
    axios,
    `files/v2/query/${file.uuid}/download/`,
    file.name,
  );
}

export function filesDeleteFile(file: RecordsDocument): Promise<void> {
  return axios.delete(`files/v2/${file.uuid}/`).then();
}
