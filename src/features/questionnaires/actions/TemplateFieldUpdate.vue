<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate } from "lorga-ui";
import { formFieldFields } from "@/features/questionnaires/fields/template_field";

const props = defineProps<{
  query: () => void;
  templateFieldId: number;
  templateFieldName: string;
  templateFieldOrder: number;
  templateFieldQuestion: string;
  templateFieldType: string;
}>();

const { commandRequest, commandModalOpen } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    title="Update Field"
    :fields="formFieldFields"
    :data="{
      id: templateFieldId,
      name: templateFieldName,
      order: templateFieldOrder,
      question: templateFieldQuestion,
      type: templateFieldType,
    }"
    :request="commandRequest"
  />
</template>
