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
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  id: number;
  recordname: string;
  username: string;
}>();
const { query, id } = toRefs(props);

const client = useClient();
const request = client.post<{ id: number }>(
  "api/records/accesses/{id}/decline/",
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
