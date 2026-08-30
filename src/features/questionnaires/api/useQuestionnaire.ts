import { ref, Ref, watch } from "vue";

import useQuery2 from "@/composables/useQuery2";
import useUrl from "@/composables/useUrl";

export interface QuestionnaireField {
  id: number;
  type: string;
  name: string;
  question: string;
}

export interface QuestionnaireAnswer {
  id: number;
  data: string;
  field: QuestionnaireField;
}

export interface QuestionnaireTemplate {
  id: number;
  rlc: number;
  name: string;
  notes: string;
  updated: string;
  created: string;
}

export interface Questionnaire {
  id: number;
  uuid: string;
  code: string;
  record: number;
  template: QuestionnaireTemplate;
  answers: QuestionnaireAnswer[];
  created: string;
  updated: string;
}

export function useQuestionnaire(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const questionnaire = ref<Questionnaire>();

  const url = useUrl("/api/questionnaires/query/{id}/", {
    pathParams: { id: selectedId },
  });

  const query = useQuery2(url, questionnaire, {
    autoFetchOnUrlChange: false,
  });

  const isLoading = ref(false);

  const update = () => {
    if (questionnaire.value && selectedId.value !== questionnaire.value.uuid)
      questionnaire.value = undefined;
    if (selectedType.value === "QUESTIONNAIRE" && selectedId.value) {
      isLoading.value = true;
      query().finally(() => {
        isLoading.value = false;
      });
    }
  };

  watch(selectedId, () => {
    update();
  });

  update();

  return { questionnaire, isLoading };
}
