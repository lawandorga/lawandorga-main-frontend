<template>
  <ModalDelete
    v-model="deleteModalOpen"
    :object="temporary"
    :request="deleteRequest"
    title="Delete Questionnaire"
  />
  <ModalCreate
    v-model="createModalOpen"
    title="Publish Questionnaire"
    :fields="fields"
    :request="createRequest"
    :initial="{ record: $route.params.record }"
    submit="Publish"
  ></ModalCreate>
</template>

<script setup lang="ts">
import { ModalCreate } from "@lawandorga/components";
import {
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireTemplate,
} from "@/types/records";
import { ref, watch } from "vue";
import RecordsService from "@/services/records";
import { ModalDelete } from "@lawandorga/components";
import useDelete from "@/composables/useDelete";
import useGet from "@/composables/useGet";
import useCreate from "@/composables/useCreate";
import { FormField } from "@/types/form";
import { useAlertStore } from "@/store/alert";
import { useRoute } from "vue-router";

// get
const route = useRoute();
const questionnaires = ref<Questionnaire[] | null>(null);
useGet(
  RecordsService.getQuestionnaires,
  questionnaires,
  route.params.record as string,
);

// fields
const fields = ref<FormField[]>([
  {
    label: "Template",
    name: "template",
    type: "select",
    required: true,
    options: [] as QuestionnaireTemplate[],
  },
]);

// copy
const alertStore = useAlertStore();
const base = window.location.origin;
const copyLink = (recordQuestionnaire: Questionnaire) => {
  navigator.clipboard
    .writeText(`${base}/records/upload/${recordQuestionnaire.code}/`)
    .then(() => alertStore.showSuccess("Link Copied"));
};

// download
const downloadFile = (answer: QuestionnaireAnswer) => {
  RecordsService.downloadQuestionnaireAnswerFile(answer);
};

// create
const { createRequest, createModalOpen, temporary } = useCreate(
  RecordsService.createQuestionnaire,
  questionnaires,
);
watch(createModalOpen, (newValue) => {
  if (newValue)
    RecordsService.getQuestionnaireTemplates().then(
      (templates) => (fields.value[0].options = templates),
    );
});

// delete
const { deleteModalOpen, deleteRequest } = useDelete(
  RecordsService.deleteQuestionnaire,
  questionnaires,
);

// expose
defineExpose({
  base,
  questionnaires,
  copyLink,
  downloadFile,
  createModalOpen,
  deleteModalOpen,
  temporary,
});
</script>
