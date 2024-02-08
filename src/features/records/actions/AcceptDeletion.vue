<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Accept
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Accept Deletion-Request"
    :request="commandRequest"
    :data="{
      delete_uuid: deletionUuid,
      action: 'records/accept_deletion_request',
    }"
    submit="Delete Record"
  >
    Are you sure you want to accept the deletion request?
    <b>The record will be deleted.</b>
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{ query: () => void; deletionUuid: string }>();
const { query, deletionUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
