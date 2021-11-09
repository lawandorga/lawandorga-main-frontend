import {
  Consultant,
  Country,
  Record,
  RecordDeletionRequest,
  RecordPermissionRequest,
  RestrictedRecord,
  Tag,
} from "@/types/records";
import axios from "../api";

class RecordsService {
  // records
  createRecord(record: Record): Promise<Record> {
    return axios
      .post<Record>("records/records/", record)
      .then((response) => response.data);
  }

  getRecords(): Promise<RestrictedRecord[]> {
    return axios
      .get<RestrictedRecord[]>("records/records/")
      .then((response) => response.data);
  }

  deleteRecord(record: RestrictedRecord): Promise<void> {
    return axios.delete(`records/records/${record.id}/`).then();
  }

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
