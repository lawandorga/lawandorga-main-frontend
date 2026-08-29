import { ref } from "vue";

import useQuery2 from "@/composables/useQuery2";

export interface RecordTemplate {
  id: number;
  name: string;
  rlc: number;
  create: string;
  updated: string;
  show: string[];
}

export function useTemplates() {
  const templates = ref<RecordTemplate[]>();
  const query = useQuery2("api/data_sheets/query/templates/", templates);

  return {
    query,
    templates,
  };
}
