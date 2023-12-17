<template>
  <div v-if="questionnaire">
    <BoxHeadingStats
      :title="questionnaire.template.name"
      :show="
        selectedId === questionnaire.uuid && selectedType === 'QUESTIONNAIRE'
      "
      :stats="[
        `Published: ${formatDate(questionnaire.created)}`,
        `Link: ${base}/records/upload/${questionnaire.code}/`,
      ]"
    >
      <template #buttons>
        <ButtonNormal kind="action" @click="copyLink(questionnaire)">
          Copy Link
        </ButtonNormal>
        <QuestionnaireDelete
          :questionnaire-id="questionnaire.id"
          :questionnaire-name="questionnaire.code"
          :query="query"
          @deleted="questionnaire = null"
        />
      </template>

      <dl class="grid grid-cols-1 gap-x-4 gap-y-8">
        <div v-for="answer in questionnaire.answers" :key="answer.id" class="">
          <dt class="text-sm font-medium text-gray-500">
            {{ answer.field.question }}
          </dt>
          <dd
            v-if="answer.field.type === 'TEXTAREA'"
            class="mt-1 text-sm text-gray-900 break-words"
          >
            {{ answer.data }}
          </dd>
          <dd
            v-if="answer.field.type === 'FILE'"
            class="mt-1 text-sm text-gray-900"
          >
            <div
              class="border border-gray-200 divide-y divide-gray-200 rounded-md"
            >
              <div
                class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
              >
                <div class="flex items-center flex-1 w-0">
                  <PaperClipIcon
                    class="flex-shrink-0 w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span class="flex-1 w-0 ml-2 truncate">
                    {{ answer.data ? answer.data.split("/").at(-1) : "Error" }}
                  </span>
                </div>
                <div class="flex-shrink-0 ml-4">
                  <QuestionnaireFileDownload
                    :questionnaire-file-id="answer.id"
                    :file-name="answer.data"
                  />
                </div>
              </div>
            </div>
          </dd>
        </div>
        <div
          v-if="!questionnaire.answers || questionnaire.answers.length === 0"
          class="text-base text-gray-500"
        >
          No answers yet.
        </div>
      </dl>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading">
    <CircleLoader />
  </div>
</template>

<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { ButtonNormal, CircleLoader } from "lorga-ui";
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { formatDate } from "@/utils/date";
import useQuery from "@/composables/useQuery";
import { IQuestionnaire } from "@/types/questionnaire";
import { Ref, ref, toRefs, watch } from "vue";
import { useAlertStore } from "@/store/alert";
import QuestionnaireFileDownload from "../actions/QuestionnaireFileDownload.vue";
import QuestionnaireDelete from "../actions/QuestionnaireDelete.vue";
import useClient from "@/api/client";

const props = defineProps<{
  selectedId: number | string | null;
  selectedType: string;
  query: () => void;
}>();

const { selectedId, query, selectedType } = toRefs(props);

const questionnaire = ref<IQuestionnaire | null>(null);

const loading = ref(false);

const client = useClient();
const request = client.get(`/api/questionnaires/query/{}/`, selectedId);

const questionnaireQuery = useQuery(
  request,
  questionnaire,
  selectedId as Ref<string>,
);

const update = () => {
  if (questionnaire.value && selectedId.value !== questionnaire.value.uuid)
    questionnaire.value = null;
  if (selectedType.value === "QUESTIONNAIRE" && selectedId.value) {
    loading.value = true;
    questionnaireQuery().then(() => {
      loading.value = false;
    });
  }
};
watch(selectedId, () => {
  update();
});
update();

// copy link
const alertStore = useAlertStore();
const base = window.location.origin;
const copyLink = (recordQuestionnaire: IQuestionnaire) => {
  navigator.clipboard
    .writeText(`${base}/records/upload/${recordQuestionnaire.code}/`)
    .then(() => alertStore.showSuccess("Link Copied"));
};
</script>
