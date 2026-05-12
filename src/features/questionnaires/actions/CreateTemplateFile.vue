<script setup lang="ts">
import { ButtonNormal, ModalCreate } from "lorga-ui";

import useCmd from "@/composables/useCmd";
import { formFileFields } from "@/features/questionnaires/fields/template_file";

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
    :data="{ template_id: templateId, action: 'questionnaires/add_file' }"
  />
</template>
