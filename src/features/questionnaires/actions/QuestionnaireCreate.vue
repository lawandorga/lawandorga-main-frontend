<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
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

const request = useClient().post("api/questionnaires/templates/");

const { commandModalOpen, commandRequest } = useCommand(request, props.query);
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
  />
</template>
