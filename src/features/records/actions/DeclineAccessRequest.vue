<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Access-Request"
    :request="commandRequest"
    :data="{ uuid: accessRequestUuid }"
    submit="Decline"
  >
    Are you sure you want to decline the access request?
    {{ username }} will not get access to '{{ recordname }}'.
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
  recordname: string;
  username: string;
}>();
const { query, accessRequestUuid } = toRefs(props);

const client = useClient();
const request = client.post(
  "api/records/v2/access_requests/{}/decline/",
  accessRequestUuid,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
