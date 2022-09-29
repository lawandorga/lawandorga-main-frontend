import { AxiosResponse } from "axios";

function createObjectURL(data: Blob): string {
  if (window.webkitURL) {
    return window.webkitURL.createObjectURL(data);
  } else if (window.URL && window.URL.createObjectURL) {
    return window.URL.createObjectURL(data);
  } else {
    throw "No object url could be created.";
  }
}

export default function downloadFile(
  response: AxiosResponse<Blob>,
  name: string,
  openedWindow: Window,
): void {
  const filename: string = name;
  const objectUrl = createObjectURL(response.data);

  if (name.split(".").pop() === "pdf") {
    openedWindow.location = objectUrl;
  } else {
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("target", "_blank");
    downloadLink.href = objectUrl;
    downloadLink.setAttribute("download", filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
