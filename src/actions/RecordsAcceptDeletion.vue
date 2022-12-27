<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Accept
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Accept Deletion-Request"
    :request="commandRequest"
    :data="{ id }"
    submit="Delete Record"
  >
    Are you sure you want to accept the deletion request?
    <b>The record will be deleted.</b>
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal } from "@lawandorga/components";
import { ModalConfirm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import axios from "axios";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void; id: number }>();
const { query, id } = toRefs(props);

function recordsAcceptDeletion(data: { id: number }) {
  return axios.post(`records/deletions/${data.id}/accept/`).then();
}

const { commandRequest, commandModalOpen } = useCommand(
  recordsAcceptDeletion,
  query.value,
);
</script>
