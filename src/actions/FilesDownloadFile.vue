<template>
  <ButtonNormal kind="action" @click="downloadFile">Download File</ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";
import { downloadFileRequest } from "@/utils/download";
import axios from "axios";

function request(data: { uuid: string; name: string }): void {
  downloadFileRequest(
    axios,
    `files/v2/query/${data.uuid}/download/`,
    data.name,
  );
}

const props = defineProps<{
  name: string;
  fileUuid: string;
  query: () => void;
}>();
const { name, fileUuid, query } = toRefs(props);

const downloadFile = () => {
  request({ name: name.value, uuid: fileUuid.value });
  query.value();
};
</script>
