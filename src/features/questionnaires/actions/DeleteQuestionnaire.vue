<script lang="ts" setup>
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";

const props = defineProps<{
  query: () => void;
  questionnaireId: number;
  questionnaireName: string;
}>();

const emit = defineEmits(["deleted"]);

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
      questionnaire_id: questionnaireId,
      action: 'questionnaires/delete_questionnaire',
    }"
    @deleted="emit('deleted')"
  />
</template>
