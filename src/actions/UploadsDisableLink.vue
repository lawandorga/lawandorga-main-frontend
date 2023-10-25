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
const request = client.post(`api/uploads/links/${linkUuid.value}/disable/`);

// disable
const { commandModalOpen, commandRequest } = useCommand(request, query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>
