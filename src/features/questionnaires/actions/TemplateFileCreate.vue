<script setup lang="ts">
import { ButtonNormal, ModalCreate } from "lorga-ui";
import { formFileFields } from "@/features/questionnaires/fields/template_file";
import useCmd from "@/composables/useCmd";

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
    title="Add File"
    :fields="formFileFields"
    :request="commandRequest"
    :data="{ questionnaire: templateId }"
  />
</template>
