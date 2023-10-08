<script setup lang="ts">
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { IQuestionnaireTemplate } from "@/types/questionnaire";
import { computed, ref, toRefs, watch } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

const props = defineProps<{ query: () => void; folderUuid?: string }>();
const { query, folderUuid } = toRefs(props);

const client = useClient();
const request = client.post("api/questionnaires/questionnaires/v2/publish/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

const getRequest = client.get("api/questionnaires/query/templates/");

const templates = ref<IQuestionnaireTemplate[]>();
const getQuery = useQuery(getRequest, templates);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Template",
    name: "template",
    type: "select",
    required: true,
    options: templates.value
      ? templates.value.map((template) => ({
          label: template.name,
          value: template.id,
        }))
      : [],
  },
]);

watch(commandModalOpen, (newValue) => {
  if (newValue) getQuery();
});

defineExpose({
  commandModalOpen,
});
</script>

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
  />
</template>
