import { computed, ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { types } from "lorga-ui";

export type Questionnaire = {
  id: number;
  template: {
    id: number;
    name: string;
    notes: string;
    files: {
      id: number;
      name: string;
    }[];
  };
  fields: {
    id: number;
    name: string;
    question: string;
    type: string;
    required: boolean;
  }[];
};

export type Error = {
  error: string;
};

export type Response = Questionnaire | Error;

export function useQuestionnaireToFillOut(code: string) {
  const data = ref<Response>();

  const client = useClient();
  const request = client.get(
    "api/questionnaires/query/fill_out_questionnaire/{}/",
    code,
  );
  const query = useGet(request, data);

  const error = computed(() => {
    if (data.value && "error" in data.value) return data.value.error;
    return "";
  });

  const questionnaire = computed<Questionnaire | undefined>(() => {
    if (data.value && !("error" in data.value))
      return data.value as Questionnaire;
    return undefined;
  });

  const fields = computed<types.FormField[]>(() => {
    if (data.value && "fields" in data.value)
      return data.value.fields.map(
        (field) =>
          ({
            label: field.question,
            name: field.name,
            type: field.type.toLowerCase(),
            required: false,
          }) as types.FormField,
      );
    return [];
  });

  return { questionnaire, error, query, fields };
}
