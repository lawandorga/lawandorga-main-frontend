<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Decline
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Decline Access-Request"
    :request="commandRequest"
    :data="{
      access_uuid: accessRequestUuid,
      action: 'records/decline_access_request',
    }"
    submit="Decline"
  >
    Are you sure you want to decline the access request?
    {{ username }} will not get access to '{{ recordname }}'.
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  accessRequestUuid: string;
  recordname: string;
  username: string;
}>();
const { query, accessRequestUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
