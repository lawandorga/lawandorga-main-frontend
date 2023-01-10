import { IMessage } from "@/types/messages";
import axios from "axios";

export function messagesGetMessages(uuid: string): Promise<IMessage[]> {
  return axios.get(`messages/query/${uuid}/`).then((r) => r.data);
}

export function messagesOptimize(): Promise<void> {
  return axios.post("messages/messages/optimize/").then();
}
