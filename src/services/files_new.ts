import { RecordsDocument } from "@/types/records";
import axios from "axios";

export function filesRetrieveFile(uuid: string): Promise<RecordsDocument> {
  return axios.get(`files/v2/query/${uuid}/`).then((r) => r.data);
}
