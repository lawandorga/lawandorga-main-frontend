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
    :initial="{ record: $route.params.id }"
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
import useDeleteItem from "@/composables/useDeleteItem";
import useGet from "@/composables/useGet";
import useCreateItem from "@/composables/useCreateItem";
import { FormField } from "@/types/form";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

// get
const route = useRoute();
const questionnaires = ref<Questionnaire[] | null>(null);
useGet(
  RecordsService.getQuestionnaires,
  questionnaires,
  route.params.id as string,
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
const store = useStore();
const base = window.location.origin;
const copyLink = (recordQuestionnaire: Questionnaire) => {
  navigator.clipboard
    .writeText(`${base}/records/upload/${recordQuestionnaire.code}/`)
    .then(() => store.dispatch("alert/showSuccess", "Link Copied"));
};

// download
const downloadFile = (answer: QuestionnaireAnswer) => {
  RecordsService.downloadQuestionnaireAnswerFile(answer);
};

// create
const { createRequest, createModalOpen, temporary } = useCreateItem(
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
const { deleteModalOpen, deleteRequest } = useDeleteItem(
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
