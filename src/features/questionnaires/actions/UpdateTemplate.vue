<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId: number;
  templateName: string;
  templateNotes: string;
}>();
const { templateId } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Note",
    name: "notes",
    type: "textarea",
    required: false,
  },
];

const { commandModalOpen, commandRequest } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    title="Change Questionnaire Template"
    :request="commandRequest"
    :fields="fields"
    :data="{
      name: templateName,
      template_id: templateId,
      notes: templateNotes,
      action: 'questionnaires/update_template',
    }"
  />
</template>
