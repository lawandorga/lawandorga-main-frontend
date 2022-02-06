<template>
  <div
    v-if="recordQuestionnaire"
    class="max-w-2xl bg-white shadow mx-auto px-6 py-5"
  >
    <h2 class="text-2xl font-bold mb-3">
      Questionnaire: {{ recordQuestionnaire.template.name }}
    </h2>
    <p
      v-if="recordQuestionnaire.template.notes"
      class="text-lg text-gray-500 mb-10"
    >
      {{ recordQuestionnaire.template.notes }}
    </p>
    <div v-if="recordQuestionnaire.template.files.length">
      <h3 class="mb-1 text-gray-700">Files to download or fill out:</h3>
      <ul class="space-y-2">
        <li v-for="file in recordQuestionnaire.template.files" :key="file.id">
          <div class="border border-gray-200 rounded-md">
            <div
              class="pl-2 pr-3 py-2 flex items-center justify-between text-sm"
            >
              <div class="w-0 flex-1 flex items-center">
                <PaperClipIcon
                  class="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span class="ml-2 flex-1 w-0 truncate">
                  {{ file.name }}
                </span>
              </div>
              <div class="ml-4 flex-shrink-0">
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
import { computed, defineComponent, ref } from "@vue/runtime-core";
import FormGenerator from "@/components/FormGenerator.vue";
import { Questionnaire } from "@/types/records";
import useGetItem from "@/composables/useGetItem";
import RecordsService from "@/services/records";
import { useRoute } from "vue-router";
import { JsonModel } from "@/types/shared";
import { PaperClipIcon } from "@heroicons/vue/outline";
import ButtonNormal from "@/components/ButtonNormal.vue";

export default defineComponent({
  components: {
    ButtonNormal,
    PaperClipIcon,
    FormGenerator,
  },
  setup() {
    const recordQuestionnaire = ref<Questionnaire | null>(null);
    const route = useRoute();

    useGetItem(
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
