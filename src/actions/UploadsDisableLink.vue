<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Disable Link
    <ModalConfirm
      v-model="commandModalOpen"
      title="Disable Link"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Disable"
    >
      Are you sure you want to disable this link? No files can be uploaded on a
      disabled link and it can not be enabled again.
    </ModalConfirm>
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

// props
const props = defineProps<{
  linkUuid: string;
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query, linkUuid } = toRefs(props);

// request
const client = useClient();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const request = (data: Record<string, any>, uuid: string) =>
  client.post(`api/uploads/links/${uuid}/disable/`)(data);

// disable
const { commandModalOpen, commandRequest } = useCommand(
  request,
  query.value,
  linkUuid,
);

// expose
defineExpose({
  commandModalOpen,
});
</script>
