<template>
  <ButtonNormal
    v-if="userLocked"
    kind="action"
    @click="commandModalOpen = true"
  >
    Unlock
    <ModalConfirm
      v-model="commandModalOpen"
      title="Unlock User"
      :request="commandRequest"
      :data="{ another_rlc_user_id: userId, action: 'auth/unlock_user' }"
    >
      Are you sure you want to unlock '{{ userName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  userId: number;
  query: () => void;
  userLocked: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
