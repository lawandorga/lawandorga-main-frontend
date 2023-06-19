<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId: number;
  templateName: string;
}>();
const { templateId } = toRefs(props);

const request = useClient().delete(
  "api/questionnaires/templates/{}/",
  templateId,
);

const { commandModalOpen, commandRequest } = useCommand(request, props.query);
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
      name: templateName,
      id: templateId,
    }"
  />
</template>
