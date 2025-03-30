<script setup lang="ts">
import useClient from "@/api/client";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  questionnaireFileId: number;
  fileName: string;
}>();
const { questionnaireFileId, fileName } = toRefs(props);

const client = useClient();
const request = client.downloadFile(
  "/api/questionnaires/query/download_answer_file/{id}/",
);

const downloadFile = () => {
  request({
    id: questionnaireFileId.value,
    filename: fileName.value.split("/").pop() || "answer-file",
  });
};
</script>

<template>
  <ButtonNormal kind="action" @click="downloadFile()">Download</ButtonNormal>
</template>
