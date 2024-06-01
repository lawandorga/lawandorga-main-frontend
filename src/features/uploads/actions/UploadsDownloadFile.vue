<template>
  <ButtonNormal kind="action" @click="download">Download File</ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  fileUuid: string;
  linkUuid: string | number | null;
  name: string;
}>();
const { fileUuid, linkUuid, name } = toRefs(props);

const client = useClient();
const request = client.downloadFile(
  "api/uploads/query/{}/{}/",
  linkUuid,
  fileUuid,
);

const download = () => {
  request({ filename: name.value });
};
</script>
