<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
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

const request = useClient().post(
  "api/questionnaires/templates/{}/",
  templateId,
);

const { commandModalOpen, commandRequest } = useCommand(request, props.query);
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
      id: templateId,
      notes: templateNotes,
    }"
  />
</template>
