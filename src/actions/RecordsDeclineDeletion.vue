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
import { ButtonNormal, ModalConfirm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{ query: () => void; id: number }>();
const { query, id } = toRefs(props);

const client = useClient();
const request = client.post<{ id: number }>(
  "api/records/deletions/{id}/decline/",
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
