<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Publish Questionnaire

    <ModalCreate
      v-model="commandModalOpen"
      title="Publish Questionnaire"
      :fields="fields"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Publish"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { IQuestionnaireTemplate } from "@/types/questionnaire";
import { ref, toRefs, watch } from "vue";
import RecordsService from "@/services/records";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

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

const client = useClient();
const request = client.post("api/questionnaires/questionnaires/v2/publish/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

watch(commandModalOpen, (newValue) => {
  if (newValue)
    RecordsService.getQuestionnaireTemplates().then(
      (templates) => (fields.value[0].options = templates),
    );
});

defineExpose({
  commandModalOpen,
});
</script>
