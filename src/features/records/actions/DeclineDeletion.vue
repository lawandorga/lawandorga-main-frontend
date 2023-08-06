<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Deletion-Request"
    :request="commandRequest"
    :data="{ uuid: deletionUuid }"
    submit="Decline"
  >
    Are you sure you want to decline the deletion request?
    <b>The record will not be deleted.</b>
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{ query: () => void; deletionUuid: string }>();
const { query, deletionUuid } = toRefs(props);

const client = useClient();
const request = client.post("api/records/deletions/{}/decline/", deletionUuid);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
