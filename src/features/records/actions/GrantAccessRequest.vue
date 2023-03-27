<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Grant Access"
    :request="commandRequest"
    :data="{ uuid: accessRequestUuid }"
    submit="Grant Access"
  >
    Are you sure you want to grant the access request?
    {{ username }} will get access to '{{ recordname }}'.
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  accessRequestUuid: string;
  username: string;
  recordname: string;
}>();
const { query, accessRequestUuid } = toRefs(props);

const client = useClient();
const request = client.post<{ id: number }>(
  "api/records/v2/access_requests/{}/grant/",
  accessRequestUuid,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
