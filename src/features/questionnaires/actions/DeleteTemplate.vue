<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId: number;
  templateName: string;
}>();
const { templateId } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Questionnaire Template"
    :request="commandRequest"
    :data="{
      template_id: templateId,
      action: 'questionnaires/delete_template',
    }"
  />
</template>
