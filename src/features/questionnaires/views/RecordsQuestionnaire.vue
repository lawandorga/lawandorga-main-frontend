<script lang="ts" setup>
import { PaperClipIcon } from "@heroicons/vue/24/outline";
import { FormGenerator } from "lorga-ui";
import { computed } from "vue";
import { useRoute } from "vue-router";

import useCmd from "@/composables/useCmd";

import TemplateFileDownload from "../actions/DownloadTemplateFile.vue";
import { useQuestionnaireToFillOut } from "../api/useQuestionnaireToFillOut";

const route = useRoute();
const { questionnaire, fields, query, error } = useQuestionnaireToFillOut(
  route.params.code as string,
);

const { commandRequest } = useCmd(query);

const sendAnswer = computed(() => (data: Record<string, string>) => {
  const formData = new FormData();
  formData.append("action", "questionnaires/submit_answers");
  formData.append("questionnaire_id", questionnaire.value!.id.toString());
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return commandRequest(formData);
});
</script>

<template>
  <div class="mx-auto max-w-2xl bg-white px-6 py-5 shadow">
    <template v-if="error">
      <div class="">{{ error }}</div>
    </template>
    <template v-else-if="questionnaire">
      <h2 class="mb-3 text-2xl font-bold">
        Questionnaire: {{ questionnaire.template.name }}
      </h2>
      <p
        v-if="questionnaire.template.notes"
        class="mb-10 text-lg text-gray-500"
      >
        {{ questionnaire.template.notes }}
      </p>
      <div v-if="questionnaire.template.files.length">
        <h3 class="mb-1 text-gray-700">Files to download or fill out:</h3>
        <ul class="space-y-2">
          <li v-for="file in questionnaire.template.files" :key="file.id">
            <div class="rounded-md border border-gray-200">
              <div
                class="flex items-center justify-between py-2 pr-3 pl-2 text-sm"
              >
                <div class="flex w-0 flex-1 items-center">
                  <PaperClipIcon
                    class="h-5 w-5 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span class="ml-2 w-0 flex-1 truncate">
                    {{ file.name }}
                  </span>
                </div>
                <div class="ml-4 shrink-0">
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
    </template>
  </div>
</template>
