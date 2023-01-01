import axios from "axios";

export function questionnairesOptimize(): Promise<void> {
  return axios.post("questionnaires/questionnaires/v2/optimize/").then();
}
