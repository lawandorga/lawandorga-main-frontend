import { HasPermission } from "@/types/core";
import {
  Message,
  Record,
  RecordDeletion,
  RecordAccess,
  QuestionnaireTemplate,
  Questionnaire,
  Pool,
  QuestionnaireAnswer,
  QuestionnaireQuestion,
  QuestionnaireTemplateFile,
  RecordTemplate,
  RecordEntry,
  RecordField,
  IRecordListPage,
} from "@/types/records";
import { JsonModel } from "@/types/shared";
import { downloadFileRequest } from "@/utils/download";
import axios from "axios";

export function recordsGetPage(): Promise<IRecordListPage> {
  return axios.get("records/query/").then((r) => r.data);
}

export function recordsOptimize(): Promise<void> {
  return axios.post("records/records/v2/optimize/").then();
}

export function recordsChangeName(data: {
  id: number;
  name: string;
}): Promise<void> {
  return axios.post(`records/records/v2/${data.id}/change_name/`, data).then();
}

export function recordsGetDeletions(): Promise<RecordDeletion[]> {
  return axios.get("records/query/deletions/").then((r) => r.data);
}

export function recordsCreateRecord(data: {
  name: string;
  folder: string;
  template: number;
}) {
  return axios.post(`records/records/v2/within_folder/`, data).then();
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

  createTemplate(data: JsonModel): Promise<RecordTemplate> {
    return axios
      .post<RecordTemplate>(`records/recordtemplates/`, data)
      .then((response) => response.data);
  }

  getTemplate(id: string | number): Promise<RecordTemplate> {
    return axios
      .get<RecordTemplate>(`records/recordtemplates/${id}/`)
      .then((response) => response.data);
  }

  getTemplateFields(template: RecordTemplate): Promise<RecordField[]> {
    return axios
      .get<RecordField[]>(`records/recordtemplates/${template.id}/fields/`)
      .then((response) => response.data);
  }

  updateTemplate(template: RecordTemplate): Promise<RecordTemplate> {
    return axios
      .patch<RecordTemplate>(
        `records/recordtemplates/${template.id}/`,
        template,
      )
      .then((response) => response.data);
  }

  deleteTemplate(template: RecordTemplate): Promise<void> {
    return axios
      .delete(`records/recordtemplates/${template.id}/`)
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

  createRecord(data: JsonModel): Promise<Record> {
    return axios
      .post<Record>("records/records/v2/", data)
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

  // permissions
  getGeneralPermissions(): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>("has_permissions/records/")
      .then((response) => response.data);
  }

  // questionnairetemplate
  getQuestionnaireTemplates(): Promise<QuestionnaireTemplate[]> {
    return axios
      .get<QuestionnaireTemplate[]>("questionnaires/questionnairetemplates/")
      .then((response) => response.data);
  }

  getQuestionnaireTemplate(
    id: number | string,
  ): Promise<QuestionnaireTemplate> {
    return axios
      .get<QuestionnaireTemplate>(
        `questionnaires/questionnairetemplates/${id}/`,
      )
      .then((response) => response.data);
  }

  createQuestionnaireTemplate(
    questionnaire: QuestionnaireTemplate,
  ): Promise<QuestionnaireTemplate> {
    return axios
      .post<QuestionnaireTemplate>(
        "questionnaires/questionnairetemplates/",
        questionnaire,
      )
      .then((response) => response.data);
  }

  updateQuestionnaireTemplate(
    questionnaire: QuestionnaireTemplate,
  ): Promise<QuestionnaireTemplate> {
    return axios
      .patch<QuestionnaireTemplate>(
        `questionnaires/questionnairetemplates/${questionnaire.id}/`,
        questionnaire,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireTemplate(
    questionnaire: QuestionnaireTemplate,
  ): Promise<void> {
    return axios.delete(
      `questionnaires/questionnairetemplates/${questionnaire.id}/`,
    );
  }

  // questionnairequestion
  getQuestionnaireQuestions(
    questionnaire: QuestionnaireTemplate,
  ): Promise<QuestionnaireQuestion[]> {
    return axios
      .get<QuestionnaireQuestion[]>(
        `questionnaires/questionnairetemplates/${questionnaire.id}/fields/`,
      )
      .then((response) => response.data);
  }

  createQuestionnaireQuestion(
    field: QuestionnaireQuestion,
  ): Promise<QuestionnaireQuestion> {
    return axios
      .post<QuestionnaireQuestion>(
        "questionnaires/questionnaire_fields/",
        field,
      )
      .then((response) => response.data);
  }

  updateQuestionnaireQuestion(
    field: QuestionnaireQuestion,
  ): Promise<QuestionnaireQuestion> {
    return axios
      .patch<QuestionnaireQuestion>(
        `questionnaires/questionnaire_fields/${field.id}/`,
        field,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireQuestion(field: QuestionnaireQuestion): Promise<void> {
    return axios.delete(`questionnaires/questionnaire_fields/${field.id}/`);
  }

  // questionnaire
  getQuestionnaires(id: number | string): Promise<Questionnaire[]> {
    return axios
      .get<Questionnaire[]>(`questionnaires/questionnaires/?record=${id}`)
      .then((response) => response.data);
  }

  createQuestionnaire(
    recordQuestionnaire: Questionnaire,
  ): Promise<Questionnaire> {
    return axios
      .post<Questionnaire>(
        `questionnaires/questionnaires/v2/publish/`,
        recordQuestionnaire,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaire(recordQuestionnaire: Questionnaire): Promise<void> {
    return axios
      .delete(`questionnaires/questionnaires/${recordQuestionnaire.id}/`)
      .then();
  }

  getQuestionnaire(code: string): Promise<Questionnaire> {
    return axios
      .get(`questionnaires/questionnaires/${code}/`)
      .then((response) => response.data);
  }

  sendQuestionnaireAnswer(
    data: JsonModel,
    recordQuestionnaire: Questionnaire,
  ): Promise<Questionnaire> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    return axios
      .patch<Questionnaire>(
        `questionnaires/questionnaires/${recordQuestionnaire.id}/`,
        formData,
      )
      .then((response) => response.data);
  }

  // questionnaireanswer
  downloadQuestionnaireAnswerFile(
    questionnaireAnswer: QuestionnaireAnswer,
  ): void {
    downloadFileRequest(
      axios,
      `questionnaires/questionnaire_answers/${questionnaireAnswer.id}/download_file/`,
      questionnaireAnswer.data.split("/").at(-1) || "filename",
    );
  }

  // questionnairefile
  getQuestionnaireFiles(
    questionnaire: QuestionnaireTemplate,
  ): Promise<QuestionnaireTemplateFile[]> {
    return axios
      .get<QuestionnaireTemplateFile[]>(
        `questionnaires/questionnairetemplates/${questionnaire.id}/files/`,
      )
      .then((response) => response.data);
  }

  downloadQuestionnaireFile(file: QuestionnaireTemplateFile): void {
    downloadFileRequest(
      axios,
      `questionnaires/questionnaire_files/${file.id}/`,
      file.name,
    );
  }

  createQuestionnaireFile(data: JsonModel): Promise<QuestionnaireTemplateFile> {
    const formData = new FormData();
    if (data.file) formData.append("file", data.file);
    if (data.name) formData.append("name", data.name);
    if (data.questionnaire)
      formData.append("questionnaire", data.questionnaire);

    return axios
      .post<QuestionnaireTemplateFile>(
        "questionnaires/questionnaire_files/",
        formData,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireFile(file: QuestionnaireTemplateFile): Promise<void> {
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

  // access
  getRecordAccesses(): Promise<RecordAccess[]> {
    return axios
      .get<RecordAccess[]>("records/accesses/")
      .then((response) => response.data);
  }

  updateRecordAccess(data: RecordAccess): Promise<RecordAccess> {
    return axios
      .patch<RecordAccess>(`records/accesses/${data.id}/`, data)
      .then((response) => response.data);
  }

  createRecordAccess(data: JsonModel): Promise<void> {
    return axios
      .post(`records/accesses/`, data)
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
