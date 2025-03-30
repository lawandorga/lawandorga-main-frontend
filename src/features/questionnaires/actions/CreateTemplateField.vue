<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate } from "lorga-ui";
import { formFieldFields } from "@/features/questionnaires/fields/template_field";

const props = defineProps<{
  query: () => void;
  templateId: number;
}>();

const { commandRequest, commandModalOpen } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create Field"
    :fields="formFieldFields"
    :request="commandRequest"
    :data="{
      template_id: templateId,
      action: 'questionnaires/create_question',
    }"
  />
</template>
