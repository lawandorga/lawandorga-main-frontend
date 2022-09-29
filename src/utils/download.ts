import { AxiosInstance, AxiosResponse } from "axios";

function createObjectURL(data: Blob): string {
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
