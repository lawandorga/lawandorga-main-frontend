import {
  Message,
  Record,
  RecordDeletion,
  Pool,
  RecordTemplate,
  RecordEntry,
  RecordField,
  IRecordListPage,
  IRecordAccess,
} from "@/types/records";
import {
  IQuestionnaireTemplate,
  IQuestionnaire,
  IQuestionnaireQuestion,
  IQuestionnaireTemplateFile,
} from "@/types/questionnaire";
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
  // record templates
  getTemplates(): Promise<RecordTemplate[]> {
    return axios
      .get<RecordTemplate[]>("records/recordtemplates/")
      .then((response) => response.data);
  }

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

  // records
  getRecords(): Promise<Record[]> {
    return axios
      .get<Record[]>("records/records/")
      .then((response) => response.data);
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

  updateFileEntry(data: FormData): Promise<RecordEntry> {
    return axios
      .patch<RecordEntry>(data.get("url") as string, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
        baseURL: import.meta.env.VITE_BACKEND_URL,
      })
      .then((response) => response.data);
  }

  downloadFileFromEntry(entry: RecordEntry): void {
    const url = `${entry.url}download/`.replace("api/", "");
    downloadFileRequest(axios, url, entry.value as string);
  }

  // questionnairetemplate
  getQuestionnaireTemplates(): Promise<IQuestionnaireTemplate[]> {
    return axios
      .get<IQuestionnaireTemplate[]>("questionnaires/questionnairetemplates/")
      .then((response) => response.data);
  }

  getQuestionnaireTemplate(
    id: number | string,
  ): Promise<IQuestionnaireTemplate> {
    return axios
      .get<IQuestionnaireTemplate>(
        `questionnaires/questionnairetemplates/${id}/`,
      )
      .then((response) => response.data);
  }

  // questionnairequestion
  getQuestionnaireQuestions(
    questionnaire: IQuestionnaireTemplate,
  ): Promise<IQuestionnaireQuestion[]> {
    return axios
      .get<IQuestionnaireQuestion[]>(
        `questionnaires/questionnairetemplates/${questionnaire.id}/fields/`,
      )
      .then((response) => response.data);
  }

  createQuestionnaireQuestion(
    field: IQuestionnaireQuestion,
  ): Promise<IQuestionnaireQuestion> {
    return axios
      .post<IQuestionnaireQuestion>(
        "questionnaires/questionnaire_fields/",
        field,
      )
      .then((response) => response.data);
  }

  updateQuestionnaireQuestion(
    field: IQuestionnaireQuestion,
  ): Promise<IQuestionnaireQuestion> {
    return axios
      .patch<IQuestionnaireQuestion>(
        `questionnaires/questionnaire_fields/${field.id}/`,
        field,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireQuestion(field: IQuestionnaireQuestion): Promise<void> {
    return axios.delete(`questionnaires/questionnaire_fields/${field.id}/`);
  }

  // questionnaire
  getQuestionnaires(id: number | string): Promise<IQuestionnaire[]> {
    return axios
      .get<IQuestionnaire[]>(`questionnaires/questionnaires/?record=${id}`)
      .then((response) => response.data);
  }

  createQuestionnaire(
    recordQuestionnaire: IQuestionnaire,
  ): Promise<IQuestionnaire> {
    return axios
      .post<IQuestionnaire>(
        `questionnaires/questionnaires/v2/publish/`,
        recordQuestionnaire,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaire(recordQuestionnaire: IQuestionnaire): Promise<void> {
    return axios
      .delete(`questionnaires/questionnaires/${recordQuestionnaire.id}/`)
      .then();
  }

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
  getQuestionnaireFiles(
    questionnaire: IQuestionnaireTemplate,
  ): Promise<IQuestionnaireTemplateFile[]> {
    return axios
      .get<IQuestionnaireTemplateFile[]>(
        `questionnaires/questionnairetemplates/${questionnaire.id}/files/`,
      )
      .then((response) => response.data);
  }

  downloadQuestionnaireFile(file: { id: number; name: string }): void {
    downloadFileRequest(
      axios,
      `questionnaires/questionnaire_files/${file.id}/`,
      file.name,
    );
  }

  createQuestionnaireFile(
    data: JsonModel,
  ): Promise<IQuestionnaireTemplateFile> {
    const formData = new FormData();
    if (data.file) formData.append("file", data.file);
    if (data.name) formData.append("name", data.name);
    if (data.questionnaire)
      formData.append("questionnaire", data.questionnaire);

    return axios
      .post<IQuestionnaireTemplateFile>(
        "questionnaires/questionnaire_files/",
        formData,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireFile(file: IQuestionnaireTemplateFile): Promise<void> {
    return axios
      .delete(`questionnaires/questionnaire_files/${file.id}/`)
      .then();
  }

  // messages
  getMessages(id: string | number): Promise<Message[]> {
    return axios
      .get<Message[]>(`records/messages/?record=${id}`)
      .then((response) => response.data);
  }

  createMessage(data: JsonModel): Promise<Message> {
    return axios
      .post<Message>(`records/messages/`, data)
      .then((response) => response.data);
  }

  // pool
  getPool(): Promise<Pool> {
    return axios
      .get<Pool>("records/pool_records/status/")
      .then((response) => response.data);
  }

  yieldRecord(data: JsonModel): Promise<void> {
    return axios.post("records/pool_records/", { record: data.record }).then();
  }

  enlist(): Promise<string> {
    return axios
      .post<{ action: string }>("records/pool_consultants/", {})
      .then((response) => {
        const message =
          response.data.action === "created"
            ? "You enlisted successfully into the record pool."
            : "You've been given a record";
        return message;
      });
  }
}

export default new RecordsService();
