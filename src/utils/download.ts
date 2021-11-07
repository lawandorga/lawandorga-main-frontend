import { AxiosResponse } from "axios";

export default function downloadFile(
  response: AxiosResponse<Blob>,
  name: string,
): void {
  const filename: string = name;
  if (name.split(".").pop() === "pdf") {
    const fileUrl = window.URL.createObjectURL(response.data);
    window.open(fileUrl);
  } else {
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(response.data);
    downloadLink.setAttribute("download", filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
