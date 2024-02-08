<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Deletion-Request"
    :request="commandRequest"
    :data="{
      delete_uuid: deletionUuid,
      action: 'records/decline_deletion_request',
    }"
    submit="Decline"
  >
    Are you sure you want to decline the deletion request?
    <b>The record will not be deleted.</b>
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
