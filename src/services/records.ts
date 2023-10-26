import { Record } from "@/types/records";
import axios from "axios";

export function recordsOptimize(): Promise<void> {
  return axios.post("data_sheets/data_sheets/optimize/").then();
}

export function recordsGetRecord(uuid: string): Promise<Record> {
  return axios.get(`records/query/${uuid}/`).then((r) => r.data);
}
