<template>
  <div
    v-if="recordQuestionnaire"
    class="max-w-2xl bg-white shadow mx-auto px-6 py-5"
  >
    <h2 class="text-2xl font-bold">
      Questionnaire: {{ recordQuestionnaire.questionnaire.name }}
    </h2>
    <div class="pt-10">
      <FormGenerator
        v-if="fields.length > 0"
        button="Save"
        :fields="fields"
        :initial="{ id: recordQuestionnaire.id }"
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
import { RecordQuestionnaire } from "@/types/records";
import useGetItem from "@/composables/useGetItem";
import RecordsService from "@/services/records";
import { useRoute } from "vue-router";
import { JsonModel } from "@/types/shared";

export default defineComponent({
  components: {
    FormGenerator,
  },
  setup() {
    const recordQuestionnaire = ref<RecordQuestionnaire | null>(null);
    const route = useRoute();

    useGetItem(
      RecordsService.getRecordQuestionnaire,
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
    };
  },
});
</script>
