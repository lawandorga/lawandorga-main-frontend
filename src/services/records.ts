import { Record, RecordDeletion, IRecordAccess } from "@/types/records";
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
