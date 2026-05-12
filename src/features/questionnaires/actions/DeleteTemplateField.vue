<script lang="ts" setup>
import { ButtonNormal, ModalDelete } from "lorga-ui";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  templateFieldId: number;
  templateFieldName: string;
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
      question_id: templateFieldId,
      action: 'questionnaires/delete_question',
    }"
  />
</template>
