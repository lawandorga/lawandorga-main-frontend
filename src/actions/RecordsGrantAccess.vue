<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Grant Access"
    :request="commandRequest"
    :data="{ id }"
    submit="Grant Access"
  >
    Are you sure you want to grant the access request?
    {{ username }} will get access to '{{ recordname }}'.
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal } from "@lawandorga/components";
import { ModalConfirm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import axios from "axios";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  id: number;
  username: string;
  recordname: string;
}>();
const { query, id } = toRefs(props);

function recordsGrantAccess(data: { id: number }) {
  return axios.post(`records/accesses/${data.id}/grant/`).then();
}

const { commandRequest, commandModalOpen } = useCommand(
  recordsGrantAccess,
  query.value,
);
</script>
