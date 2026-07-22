import { AxiosInstance, AxiosResponse } from "axios";

export function createObjectURL(data: Blob): string {
  if (window.webkitURL) {
    return window.webkitURL.createObjectURL(data);
  } else if (window.URL?.createObjectURL) {
    return window.URL.createObjectURL(data);
  } else {
    alert("Error downloading file.");
    throw Error("No object url could be created.");
  }
}

export function downloadFile(
  response: AxiosResponse<Blob>,
  name: string,
): void {
  const objectUrl = createObjectURL(response.data);
  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.setAttribute("download", name);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.setTimeout(() => window.URL?.revokeObjectURL(objectUrl), 0);
}

export function downloadFileRequest(
  axios: AxiosInstance,
  url: string,
  fileName: string,
): Promise<void> {
  return axios
    .get<Blob>(url, {
      responseType: "blob",
    })
    .then((response) => downloadFile(response, fileName));
}

export function getMimetypeFromDataUrl(url: string) {
  return url.substring(url.indexOf(":") + 1, url.indexOf(";"));
}

export function isDataUrlDisplayable(url: string): boolean {
  const mimeType = getMimetypeFromDataUrl(url);
  const displayable = [
    "image/png",
    "image/jpeg",
    "image/pjpeg",
    "application/pdf",
    "application/json",
    "text/plain",
    "application/javascript",
  ];
  return displayable.includes(mimeType);
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}
