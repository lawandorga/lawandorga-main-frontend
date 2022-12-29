import { AxiosInstance, AxiosResponse } from "axios";

export function createObjectURL(data: Blob): string {
  if (window.webkitURL) {
    return window.webkitURL.createObjectURL(data);
  } else if (window.URL && window.URL.createObjectURL) {
    return window.URL.createObjectURL(data);
  } else {
    throw "No object url could be created.";
  }
}

export function downloadFile(
  response: AxiosResponse<Blob>,
  name: string,
  openedWindow: Window | null,
): void {
  const filename: string = name;
  const objectUrl = createObjectURL(response.data);

  if (name.split(".").pop() === "pdf") {
    if (openedWindow) openedWindow.location = objectUrl;
    else {
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("target", "_blank");
      downloadLink.href = objectUrl;
      downloadLink.setAttribute("download", filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  } else {
    if (openedWindow) openedWindow.close();
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("target", "_blank");
    downloadLink.href = objectUrl;
    downloadLink.setAttribute("download", filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}

export function downloadFileRequest(
  axios: AxiosInstance,
  url: string,
  fileName: string,
) {
  const openedWindow = window.open();
  if (openedWindow && openedWindow.document)
    openedWindow.document.body.innerHTML =
      "One moment please. File is being downloaded...";
  axios
    .get<Blob>(url, {
      responseType: "blob",
    })
    .then((response) => downloadFile(response, fileName, openedWindow))
    .catch((e) => {
      openedWindow?.close();
      throw e;
    });
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
