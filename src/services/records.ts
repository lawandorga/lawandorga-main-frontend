import {
  Consultant,
  Country,
  Record,
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

  getTags(): Promise<Tag[]> {
    return axios.get<Tag[]>("records/tags/").then((response) => response.data);
  }

  getCountries(): Promise<Country[]> {
    return axios
      .get<Country[]>("records/origin_countries/")
      .then((response) => response.data);
  }
}

export default new RecordsService();
