<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";

const props = defineProps<{
  query: () => void;
}>();

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
    Create Template
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create Questionnaire Template"
    :request="commandRequest"
    :fields="fields"
    :data="{
      action: 'questionnaires/create_template',
    }"
  />
</template>
