<script lang="ts" setup>
import { toRefs } from "vue";
import { ModalConfirm, ButtonNormal } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  userId: number;
  query: () => void;
  userAccepted: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ButtonNormal
    v-if="!userAccepted"
    kind="action"
    @click="commandModalOpen = true"
  >
    Accept
    <ModalConfirm
      v-model="commandModalOpen"
      title="Accept User"
      :request="commandRequest"
      :data="{ user_id: userId, action: 'org/accept_member_to_org' }"
    >
      Are your sure you want to accept '{{ userName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>
