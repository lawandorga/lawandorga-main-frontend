<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  templateFileId: number;
  templateFileName: string;
}>();

const { commandRequest, commandModalOpen } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    :request="commandRequest"
    :data="{
      file_id: templateFileId,
      action: 'questionnaires/delete_file',
    }"
  />
</template>
