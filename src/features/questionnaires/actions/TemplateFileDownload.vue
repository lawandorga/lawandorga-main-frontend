<script setup lang="ts">
import useClient from "@/api/client";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  templateFileId: number;
  fileName: string;
}>();
const { templateFileId, fileName } = toRefs(props);

const client = useClient();
const request = client.downloadFile(
  "/api/questionnaires/query/download_template_file/{id}/",
);

const downloadFile = () => {
  request({ id: templateFileId.value, filename: fileName.value });
};
</script>

<template>
  <ButtonNormal kind="action" @click="downloadFile()">Download</ButtonNormal>
</template>
