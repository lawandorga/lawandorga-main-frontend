import { ref } from "vue";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

export interface RecordTemplate {
  id: number;
  name: string;
  rlc: number;
  create: string;
  updated: string;
  show: string[];
}

export function useTemplates() {
  const client = useClient();
  const request = client.get("api/data_sheets/query/templates/");
  const templates = ref<RecordTemplate[]>();
  const query = useQuery(request, templates);

  return {
    query,
    templates,
  };
}
