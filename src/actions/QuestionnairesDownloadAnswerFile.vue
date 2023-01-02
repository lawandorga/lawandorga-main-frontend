<template>
  <ButtonNormal size="xs" kind="action" @click="downloadFile(answer)">
    Download
  </ButtonNormal>
</template>

<script setup lang="ts">
import { IQuestionnaireAnswer } from "@/types/questionnaire";
import RecordsService from "@/services/records";
import { ButtonNormal } from "@lawandorga/components";

defineProps<{ answer: IQuestionnaireAnswer }>();

const downloadFile = (answer: IQuestionnaireAnswer) => {
  RecordsService.downloadQuestionnaireAnswerFile(answer);
};
</script>
