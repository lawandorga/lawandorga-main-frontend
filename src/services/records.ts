import { HasPermission } from "@/types/core";
import {
  Consultant,
  Country,
  Message,
  Record,
  RecordDeletionRequest,
  RecordPermissionRequest,
  RecordsClient,
  RecordsDocument,
  RestrictedRecord,
  Questionnaire,
  RecordQuestionnaire,
  Tag,
  Pool,
  QuestionnaireAnswer,
  QuestionnaireField,
  QuestionnaireFile,
  RecordTemplate,
  RecordEntry,
} from "@/types/records";
import { JsonModel } from "@/types/shared";
import downloadFile from "@/utils/download";
import axios from "../api";

class RecordsService {
  // record templates
  getTemplates(): Promise<RecordTemplate[]> {
    return axios
      .get<RecordTemplate[]>("records/recordtemplates/")
      .then((response) => response.data);
  }

  // records
  getRecords(): Promise<RestrictedRecord[]> {
    return axios
      .get<RestrictedRecord[]>("records/records/")
      .then((response) => response.data);
  }

  getRecord(id: number | string): Promise<Record> {
    return axios
      .get<Record>(`records/records/${id}/`)
      .then((response) => response.data);
  }

  createRecord(data: JsonModel): Promise<Record> {
    return axios
      .post<Record>("records/records/", data)
      .then((response) => response.data);
  }

  updateRecord(record: Record): Promise<Record> {
    return axios
      .patch<Record>(`records/oldrecords/${record.id}/`, record)
      .then((response) => response.data);
  }

  deleteRecord(record: RestrictedRecord): Promise<void> {
    return axios.delete(`records/oldrecords/${record.id}/`).then();
  }

  // entries
  createEntry(data: JsonModel): Promise<RecordEntry> {
    return axios
      .post<RecordEntry>(data.url as string, data)
      .then((response) => response.data);
  }

  updateEntry(data: JsonModel): Promise<RecordEntry> {
    return axios
      .patch<RecordEntry>(data.url as string, data)
      .then((response) => response.data);
  }

  // permissions
  getGeneralPermissions(): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>("has_permission/records/")
      .then((response) => response.data);
  }

  // questionnaire
  getQuestionnaires(): Promise<Questionnaire[]> {
    return axios
      .get<Questionnaire[]>("records/questionnaires/")
      .then((response) => response.data);
  }

  getQuestionnaire(id: number | string): Promise<Questionnaire> {
    return axios
      .get<Questionnaire>(`records/questionnaires/${id}/`)
      .then((response) => response.data);
  }

  createQuestionnaire(questionnaire: Questionnaire): Promise<Questionnaire> {
    return axios
      .post<Questionnaire>("records/questionnaires/", questionnaire)
      .then((response) => response.data);
  }

  updateQuestionnaire(questionnaire: Questionnaire): Promise<Questionnaire> {
    return axios
      .patch<Questionnaire>(
        `records/questionnaires/${questionnaire.id}/`,
        questionnaire,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    return axios.delete(`records/questionnaires/${questionnaire.id}/`);
  }

  // questionnairefield
  getQuestionnaireFields(
    questionnaire: Questionnaire,
  ): Promise<QuestionnaireField[]> {
    return axios
      .get<QuestionnaireField[]>(
        `records/questionnaires/${questionnaire.id}/fields/`,
      )
      .then((response) => response.data);
  }

  createQuestionnaireField(
    field: QuestionnaireField,
  ): Promise<QuestionnaireField> {
    return axios
      .post<QuestionnaireField>("records/questionnaire_fields/", field)
      .then((response) => response.data);
  }

  updateQuestionnaireField(
    field: QuestionnaireField,
  ): Promise<QuestionnaireField> {
    return axios
      .patch<QuestionnaireField>(
        `records/questionnaire_fields/${field.id}/`,
        field,
      )
      .then((response) => response.data);
  }

  deleteQuestionnaireField(field: QuestionnaireField): Promise<void> {
    return axios.delete(`records/questionnaire_fields/${field.id}/`);
  }

  // recordquestionnaire
  getRecordQuestionnaires(id: number | string): Promise<RecordQuestionnaire[]> {
    return axios
      .get<RecordQuestionnaire[]>(
        `records/oldrecords/${id}/record_questionnaires/`,
      )
      .then((response) => response.data);
  }

  createRecordQuestionnaire(
    recordQuestionnaire: RecordQuestionnaire,
  ): Promise<RecordQuestionnaire> {
    return axios
      .post<RecordQuestionnaire>(
        `records/questionnaires/publish/`,
        recordQuestionnaire,
      )
      .then((response) => response.data);
  }

  deleteRecordQuestionnaire(
    recordQuestionnaire: RecordQuestionnaire,
  ): Promise<void> {
    return axios
      .delete(`records/record_questionnaires/${recordQuestionnaire.id}/`)
      .then();
  }

  getRecordQuestionnaire(code: string): Promise<RecordQuestionnaire> {
    return axios
      .get(`records/record_questionnaires/${code}/`)
      .then((response) => response.data);
  }

  sendQuestionnaireAnswer(
    data: JsonModel,
    recordQuestionnaire: RecordQuestionnaire,
  ): Promise<RecordQuestionnaire> {
    return axios
      .patch<RecordQuestionnaire>(
        `records/record_questionnaires/${recordQuestionnaire.id}/`,
        data,
      )
      .then((response) => response.data);
  }

  // questionnaireanswer
  downloadQuestionnaireAnswerFile(
    questionnaireAnswer: QuestionnaireAnswer,
  ): void {
    axios
      .get<Blob>(
        `records/questionnaire_answers/${questionnaireAnswer.id}/download_file/`,
        {
          responseType: "blob",
        },
      )
      .then((response) =>
        downloadFile(
          response,
          questionnaireAnswer.data.split("/").at(-1) || "filename",
        ),
      );
  }

  // questionnairefile
  getQuestionnaireFiles(
    questionnaire: Questionnaire,
  ): Promise<QuestionnaireFile[]> {
    return axios
      .get<QuestionnaireFile[]>(
        `records/questionnaires/${questionnaire.id}/files/`,
      )
      .then((response) => response.data);
  }

  downloadQuestionnaireFile(file: QuestionnaireFile): void {
    axios
      .get<Blob>(`records/questionnaire_files/${file.id}/`, {
        responseType: "blob",
      })
      .then((response) => downloadFile(response, file.name));
  }

  createQuestionnaireFile(file: QuestionnaireFile): Promise<QuestionnaireFile> {
    return axios
      .post<QuestionnaireFile>("records/questionnaire_files/", file)
      .then((response) => response.data);
  }

  deleteQuestionnaireFile(file: QuestionnaireFile): Promise<void> {
    return axios.delete(`records/questionnaire_files/${file.id}/`).then();
  }

  // messages
  getMessages(id: string | number): Promise<Message[]> {
    return axios
      .get<Message[]>(`records/oldrecords/${id}/messages/`)
      .then((response) => response.data);
  }

  createMessage(message: Message): Promise<Message> {
    return axios
      .post<Message>(
        `records/oldrecords/${message.record}/add_message/`,
        message,
      )
      .then((response) => response.data);
  }

  // documents
  getDocuments(id: number | string): Promise<RecordsDocument[]> {
    return axios
      .get<RecordsDocument[]>(`records/oldrecords/${id}/documents/`)
      .then((response) => response.data);
  }

  createDocument(document: RecordsDocument): Promise<RecordsDocument> {
    return axios
      .post<RecordsDocument>(`records/record_documents/`, document)
      .then((response) => response.data);
  }

  downloadDocument(document: RecordsDocument): void {
    axios
      .get<Blob>(`records/record_documents/${document.id}/`, {
        responseType: "blob",
      })
      .then((response) => downloadFile(response, document.name));
  }

  deleteDocument(document: RecordsDocument): Promise<void> {
    return axios.delete(`records/record_documents/${document.id}/`).then();
  }

  // client
  getClient(id: number): Promise<RecordsClient> {
    return axios
      .get<RecordsClient>(`records/e_clients/${id}/`)
      .then((response) => response.data);
  }

  updateClient(client: RecordsClient): Promise<RecordsClient> {
    return axios
      .patch<RecordsClient>(`records/e_clients/${client.id}/`, client)
      .then((response) => response.data);
  }

  // consultants
  getConsultants(): Promise<Consultant[]> {
    return axios
      .get<Consultant[]>("records/consultants/")
      .then((response) => response.data);
  }

  // tags
  getTags(): Promise<Tag[]> {
    return axios.get<Tag[]>(`records/tags/`).then((response) => response.data);
  }

  createTag(tag: Tag): Promise<Tag> {
    return axios
      .post<Tag>("records/tags/", tag)
      .then((response) => response.data);
  }

  updateTag(tag: Tag): Promise<Tag> {
    return axios
      .patch<Tag>(`records/tags/${tag.id}/`, tag)
      .then((response) => response.data);
  }

  deleteTag(tag: Tag): Promise<void> {
    return axios.delete(`records/tags/${tag.id}/`);
  }

  // countries
  getCountries(): Promise<Country[]> {
    return axios
      .get<Country[]>("records/origin_countries/")
      .then((response) => response.data);
  }

  // permission
  getPermissionRequests(): Promise<RecordPermissionRequest[]> {
    return axios
      .get<RecordPermissionRequest[]>("records/record_permission_requests/")
      .then((response) => response.data);
  }

  updatePermissionRequest(
    data: RecordPermissionRequest,
  ): Promise<RecordPermissionRequest> {
    return axios
      .patch<RecordPermissionRequest>(
        `records/record_permission_requests/${data.id}/`,
        data,
      )
      .then((response) => response.data);
  }

  requestAccess(record: RestrictedRecord): Promise<RecordPermissionRequest> {
    return axios
      .post<RecordPermissionRequest>(
        `records/oldrecords/${record.id}/request_permission/`,
      )
      .then((response) => response.data);
  }

  // deletion-requests
  getDeletionRequests(): Promise<RecordDeletionRequest[]> {
    return axios
      .get<RecordDeletionRequest[]>("records/record_deletion_requests/")
      .then((response) => response.data);
  }

  createDeletionRequest(
    deletionRequest: RecordDeletionRequest,
  ): Promise<RecordDeletionRequest> {
    return axios
      .post<RecordDeletionRequest>(
        "records/record_deletion_requests/",
        deletionRequest,
      )
      .then((response) => response.data);
  }

  updateDeletionRequest(
    data: RecordDeletionRequest,
  ): Promise<RecordDeletionRequest> {
    return axios
      .patch<RecordDeletionRequest>(
        `records/record_deletion_requests/${data.id}/`,
        data,
      )
      .then((response) => response.data);
  }

  // pool
  getPool(): Promise<Pool> {
    return axios
      .get<Pool>("records/record_pool/")
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
