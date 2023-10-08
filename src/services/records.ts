import {
  Record,
  RecordDeletion,
  RecordEntry,
  RecordField,
  IRecordListPage,
  IRecordAccess,
} from "@/types/records";
import { IQuestionnaire } from "@/types/questionnaire";
import { JsonModel } from "@/types/shared";
import { downloadFileRequest } from "@/utils/download";
import axios from "axios";

export function recordsGetPage(): Promise<IRecordListPage> {
  return axios.get("records/query/").then((r) => r.data);
}

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
  // fields
  createField(data: JsonModel): Promise<RecordField> {
    return axios
      .post(data.url as string, data)
      .then((response) => response.data);
  }

  updateField(field: RecordField): Promise<RecordField> {
    return axios
      .patch(field.url, field, { baseURL: import.meta.env.VITE_BACKEND_URL })
      .then((response) => response.data);
  }

  deleteField(field: RecordField): Promise<void> {
    return axios
      .delete(field.url, { baseURL: import.meta.env.VITE_BACKEND_URL })
      .then();
  }

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

  // questionnaire
  getQuestionnaire(code: string): Promise<IQuestionnaire> {
    return axios
      .get(`questionnaires/questionnaires/${code}/`)
      .then((response) => response.data);
  }

  sendQuestionnaireAnswer(
    data: JsonModel,
    recordQuestionnaire: IQuestionnaire,
  ): Promise<IQuestionnaire> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    return axios
      .patch<IQuestionnaire>(
        `questionnaires/questionnaires/${recordQuestionnaire.id}/`,
        formData,
      )
      .then((response) => response.data);
  }

  // questionnairefile
  downloadQuestionnaireFile(file: { id: number; name: string }): void {
    downloadFileRequest(
      axios,
      `questionnaires/questionnaire_files/${file.id}/`,
      file.name,
    );
  }
}

export default new RecordsService();
