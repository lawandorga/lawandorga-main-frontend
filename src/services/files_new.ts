import { RecordsDocument } from "@/types/records";
import { blobToDataURL, downloadFileRequest } from "@/utils/download";
import axios, { AxiosProgressEvent } from "axios";
import { Ref } from "vue";

export function filesUploadMultipleFiles(
  data: {
    files: File[];
  },
  percentage: Ref<number>,
): Promise<void> {
  const formData = new FormData();

  data.files.forEach((i: File) => {
    formData.append("files", i);
  });

  percentage.value = 0;

  const config = {
    onUploadProgress: function (progressEvent: AxiosProgressEvent) {
      if (progressEvent.total)
        percentage.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
    },
  };

  return axios.post("files/v2/multiple/", formData, config).then(() => {
    setTimeout(() => {
      percentage.value = 0;
    }, 500);
  });
}

export function filesNewUploadFile(data: {
  name: string;
  folder: string;
  file: File;
}): Promise<void> {
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
