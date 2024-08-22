import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Questionnaire {
  name: string;
  folder_uuid: string;
}

export function useQuestionnaires() {
  const questionnaires = ref<Questionnaire[] | null>();
  useGet2("/api/questionnaires/query/dashboard/", questionnaires);

  return {
    questionnaires,
  };
}
