<script setup lang="ts">
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { computed, ref, toRefs, watch } from "vue";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";
import useCmd from "@/composables/useCmd";

export interface QuestionnaireTemplate {
  id: number;
  rlc: number;
  name: string;
  notes: string;
  updated: string;
  created: string;
}

const props = defineProps<{ query: () => void; folderUuid?: string }>();
const { query, folderUuid } = toRefs(props);

const client = useClient();

const { commandRequest, commandModalOpen } = useCmd(query.value);

const getRequest = client.get("api/questionnaires/query/templates/");

const templates = ref<QuestionnaireTemplate[]>([]);
const getQuery = useQuery(getRequest, templates);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Template",
    name: "template_id",
    type: "select",
    required: true,
    options: templates.value,
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
    <ModalCreate
      v-model="commandModalOpen"
      title="Publish Questionnaire"
      :fields="fields"
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        action: 'questionnaires/publish_questionnaire',
      }"
      submit="Publish"
    />
  </ButtonNormal>
</template>
