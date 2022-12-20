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
