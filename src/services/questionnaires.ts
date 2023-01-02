import { IQuestionnaire } from "@/types/questionnaire";
import axios from "axios";

export function questionnairesOptimize(): Promise<void> {
  return axios.post("questionnaires/questionnaires/v2/optimize/").then();
}

export function questionnairesGetQuestionnaire(
  uuid: string,
): Promise<IQuestionnaire> {
  return axios.get(`questionnaires/query/${uuid}/`).then((r) => r.data);
}
