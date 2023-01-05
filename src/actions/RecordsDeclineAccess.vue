<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Access-Request"
    :request="commandRequest"
    :data="{ id }"
    submit="Decline"
  >
    Are you sure you want to decline the access request?
    {{ username }} will not get access to '{{ recordname }}'.
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
  recordname: string;
  username: string;
}>();
const { query, id } = toRefs(props);

function recordsDeclineAccess(data: { id: number }) {
  return axios.post(`records/accesses/${data.id}/decline/`).then();
}

const { commandRequest, commandModalOpen } = useCommand(
  recordsDeclineAccess,
  query.value,
);
</script>
