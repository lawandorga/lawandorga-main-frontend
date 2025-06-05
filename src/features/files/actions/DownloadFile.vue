<script lang="ts" setup>
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useClient from "@/api/client";

const client = useClient();
const request = client.downloadFile("api/files/v2/query/{uuid}/download/");

const props = defineProps<{
  name: string;
  fileUuid: string;
}>();
const { name, fileUuid } = toRefs(props);

const downloadFile = () => {
  request({ filename: name.value, uuid: fileUuid.value });
};
</script>

<template>
  <ButtonNormal kind="action" @click="downloadFile">Download File</ButtonNormal>
</template>
