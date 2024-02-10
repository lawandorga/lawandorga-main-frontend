<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Grant Access"
    :request="commandRequest"
    :data="{
      access_uuid: accessRequestUuid,
      action: 'records/grant_access_request',
    }"
    submit="Grant Access"
  >
    Are you sure you want to grant the access request?
    {{ username }} will get access to '{{ recordname }}'.
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  accessRequestUuid: string;
  username: string;
  recordname: string;
}>();
const { query, accessRequestUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
