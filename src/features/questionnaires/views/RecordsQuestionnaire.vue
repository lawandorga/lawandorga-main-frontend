<template>
  <div
    v-if="recordQuestionnaire"
    class="max-w-2xl px-6 py-5 mx-auto bg-white shadow"
  >
    <h2 class="mb-3 text-2xl font-bold">
      Questionnaire: {{ recordQuestionnaire.template.name }}
    </h2>
    <p
      v-if="recordQuestionnaire.template.notes"
      class="mb-10 text-lg text-gray-500"
    >
      {{ recordQuestionnaire.template.notes }}
    </p>
    <div v-if="recordQuestionnaire.template.files.length">
      <h3 class="mb-1 text-gray-700">Files to download or fill out:</h3>
      <ul class="space-y-2">
        <li v-for="file in recordQuestionnaire.template.files" :key="file.id">
          <div class="border border-gray-200 rounded-md">
            <div
              class="flex items-center justify-between py-2 pl-2 pr-3 text-sm"
            >
              <div class="flex items-center flex-1 w-0">
                <PaperClipIcon
                  class="flex-shrink-0 w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <span class="flex-1 w-0 ml-2 truncate">
                  {{ file.name }}
                </span>
              </div>
              <div class="flex-shrink-0 ml-4">
                <TemplateFileDownload
                  :template-file-id="file.id"
                  :file-name="file.name"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-10">
      <FormGenerator
        v-if="fields.length > 0"
        button="Save"
        :fields="fields"
        :request="sendAnswer"
      ></FormGenerator>
      <p v-else class="text-lg text-gray-700">
        All questions have been answered. Thank you.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { FormGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import { useRoute } from "vue-router";
import { JsonModel } from "@/types/shared";
import { PaperClipIcon } from "@heroicons/vue/24/outline";
import useClient from "@/api/client";
import TemplateFileDownload from "../actions/TemplateFileDownload.vue";
import useCmd from "@/composables/useCmd";

interface IQuestionnaire {
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
}

const recordQuestionnaire = ref<IQuestionnaire>();
const route = useRoute();

const client = useClient();
const request = client.get(
  "api/questionnaires/query/fill_out_questionnaire/{}/",
  route.params.code as string,
);
const query = useGet(request, recordQuestionnaire);

const { commandRequest } = useCmd(query);

const sendAnswer = computed(() => (data: JsonModel) => {
  const formData = new FormData();
  formData.append("action", "questionnaires/submit_answers");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  formData.append("questionnaire_id", recordQuestionnaire.value!.id.toString());
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return commandRequest(formData);
});

const fields = computed(() => {
  if (recordQuestionnaire.value && recordQuestionnaire.value.fields)
    return recordQuestionnaire.value.fields.map((field) => ({
      label: field.question,
      name: field.name,
      type: field.type.toLowerCase(),
      required: false,
    }));
  return [];
});
</script>
