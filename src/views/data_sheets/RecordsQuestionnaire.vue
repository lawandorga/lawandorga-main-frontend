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
                <ButtonNormal
                  kind="action"
                  size="xs"
                  @click="downloadQuestionnaireFile(file)"
                >
                  Download
                </ButtonNormal>
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

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { FormGenerator, ButtonNormal } from "lorga-ui";
import { Questionnaire } from "@/types/records";
import useGet from "@/composables/useGet";
import RecordsService from "@/services/records";
import { useRoute } from "vue-router";
import { JsonModel } from "@/types/shared";
import { PaperClipIcon } from "@heroicons/vue/24/outline";

export default defineComponent({
  components: {
    ButtonNormal,
    PaperClipIcon,
    FormGenerator,
  },
  setup() {
    const recordQuestionnaire = ref<Questionnaire | null>(null);
    const route = useRoute();

    useGet(
      RecordsService.getQuestionnaire,
      recordQuestionnaire,
      route.params.code as string,
    );

    const sendAnswer = computed(
      () => (data: JsonModel) =>
        recordQuestionnaire.value
          ? RecordsService.sendQuestionnaireAnswer(
              data,
              recordQuestionnaire.value,
            ).then(
              (newRecordQuestionnaire) =>
                (recordQuestionnaire.value = newRecordQuestionnaire),
            )
          : alert("Error"),
    );

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

    return {
      fields,
      recordQuestionnaire,
      sendAnswer,
      downloadQuestionnaireFile: RecordsService.downloadQuestionnaireFile,
    };
  },
});
</script>
