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
  Tag,
  Questionnaire,
  RecordQuestionnaire,
} from "@/types/records";
import downloadFile from "@/utils/download";
import axios from "../api";

class RecordsService {
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

  createRecord(record: Record): Promise<Record> {
    return axios
      .post<Record>("records/records/", record)
      .then((response) => response.data);
  }

  updateRecord(record: Record): Promise<Record> {
    return axios
      .patch<Record>(`records/records/${record.id}/`, record)
      .then((response) => response.data);
  }

  deleteRecord(record: RestrictedRecord): Promise<void> {
    return axios.delete(`records/records/${record.id}/`).then();
  }

  // questionnaire
  getQuestionnaires(): Promise<Questionnaire[]> {
    return axios
      .get<Questionnaire[]>("records/questionnaires/")
      .then((response) => response.data);
  }

  // record questionnaire
  getRecordQuestionnaires(id: number | string): Promise<RecordQuestionnaire[]> {
    return axios
      .get<RecordQuestionnaire[]>(
        `records/records/${id}/record_questionnaires/`,
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

  // messages
  getMessages(id: string | number): Promise<Message[]> {
    return axios
      .get<Message[]>(`records/records/${id}/messages/`)
      .then((response) => response.data);
  }

  createMessage(message: Message): Promise<Message> {
    return axios
      .post<Message>(`records/records/${message.record}/add_message/`, message)
      .then((response) => response.data);
  }

  // documents
  getDocuments(id: number | string): Promise<RecordsDocument[]> {
    return axios
      .get<RecordsDocument[]>(`records/records/${id}/documents/`)
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
    return axios.get<Tag[]>("records/tags/").then((response) => response.data);
  }

  // countries
  getCountries(): Promise<Country[]> {
    return axios
      .get<Country[]>("records/origin_countries/")
      .then((response) => response.data);
  }

  // deletion-requests
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

  // permit-requests
  requestAccess(record: RestrictedRecord): Promise<RecordPermissionRequest> {
    return axios
      .post<RecordPermissionRequest>(
        `records/records/${record.id}/request_permission/`,
      )
      .then((response) => response.data);
  }
}

export default new RecordsService();
