<template>
  <ButtonNormal size="xs" kind="action" @click="downloadFile(answer)">
    Download
  </ButtonNormal>
</template>

<script setup lang="ts">
import { IQuestionnaireAnswer } from "@/types/questionnaire";
import { ButtonNormal } from "lorga-ui";
import useClient from "@/api/client";

defineProps<{ answer: IQuestionnaireAnswer }>();

const client = useClient();

const downloadFile = (answer: IQuestionnaireAnswer) => {
  client.downloadFile(
    "api/questionnaires/questionnaire_answers/{id}/download_file/",
  )({ filename: answer.data.split("/").at(-1) || "filename", id: answer.id });
};
</script>
