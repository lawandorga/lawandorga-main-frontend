<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Publish Questionnaire
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    title="Publish Questionnaire"
    :fields="fields"
    :request="commandRequest"
    :data="{ folder: folderUuid }"
    submit="Publish"
  ></ModalCreate>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { IQuestionnaireTemplate } from "@/types/questionnaire";
import { ref, toRefs, watch } from "vue";
import RecordsService from "@/services/records";
import useCommand from "@/composables/useCommand";

const props = defineProps<{ query: () => void; folderUuid?: string }>();
const { query, folderUuid } = toRefs(props);

const fields = ref<types.FormField[]>([
  {
    label: "Template",
    name: "template",
    type: "select",
    required: true,
    options: [] as IQuestionnaireTemplate[],
  },
]);

const { commandRequest, commandModalOpen } = useCommand(
  RecordsService.createQuestionnaire,
  query.value,
);

watch(commandModalOpen, (newValue) => {
  if (newValue)
    RecordsService.getQuestionnaireTemplates().then(
      (templates) => (fields.value[0].options = templates),
    );
});
</script>
