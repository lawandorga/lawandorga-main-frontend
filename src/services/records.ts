import {
  Record,
  RecordDeletion,
  RecordEntry,
  IRecordAccess,
} from "@/types/records";
import { JsonModel } from "@/types/shared";
import { downloadFileRequest } from "@/utils/download";
import axios from "axios";

export function recordsOptimize(): Promise<void> {
  return axios.post("records/records/v2/optimize/").then();
}

export function recordsGetAccessesPage(): Promise<IRecordAccess[]> {
  return axios.get("records/query/accesses/").then((r) => r.data);
}

export function recordsGetDeletions(): Promise<RecordDeletion[]> {
  return axios.get("records/query/deletions/").then((r) => r.data);
}

export function recordsGetRecord(uuid: string): Promise<Record> {
  return axios.get(`records/query/${uuid}/`).then((r) => r.data);
}

class RecordsService {
  // entries
  createEntry(data: JsonModel): Promise<RecordEntry> {
    return axios
      .post<RecordEntry>(data.url as string, data, {
        baseURL: import.meta.env.VITE_BACKEND_URL,
      })
      .then((response) => response.data);
  }

  updateEntry(data: JsonModel): Promise<RecordEntry> {
    return axios
      .patch<RecordEntry>(data.url as string, data, {
        baseURL: import.meta.env.VITE_BACKEND_URL,
      })
      .then((response) => response.data);
  }

  deleteEntry(url: string): Promise<void> {
    return axios
      .delete(url, { baseURL: import.meta.env.VITE_BACKEND_URL })
      .then();
  }

  createFileEntry(data: JsonModel): Promise<RecordEntry> {
    const formData = new FormData();
    if (data.field) formData.append("field", data.field);
    if (data.record) formData.append("record", data.record);
    if (data.file) formData.append("file", data.file);

    return axios
      .post<RecordEntry>(data.url as string, formData, {
        baseURL: import.meta.env.VITE_BACKEND_URL,
      })
      .then((response) => response.data);
  }

  downloadFileFromEntry(entry: RecordEntry): void {
    const url = `${entry.url}download/`.replace("api/", "");
    downloadFileRequest(axios, url, entry.value as string);
  }
}

export default new RecordsService();
