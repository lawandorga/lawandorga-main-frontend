<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Deletion-Request"
    :request="commandRequest"
    :data="{ id }"
    submit="Decline"
  >
    Are you sure you want to decline the deletion request?
    <b>The record will not be deleted.</b>
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

function recordsDeclineDeletion(data: { id: number }) {
  return axios.post(`records/deletions/${data.id}/decline/`).then();
}

const { commandRequest, commandModalOpen } = useCommand(
  recordsDeclineDeletion,
  query.value,
);
</script>
