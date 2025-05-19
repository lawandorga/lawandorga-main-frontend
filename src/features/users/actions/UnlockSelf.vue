<script setup lang="ts">
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { useUserStore } from "@/store/user";
import useCmd from "@/composables/useCmd";

const userStore = useUserStore();

const { commandRequest, commandModalOpen } = useCmd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unlockRequest = (data: Record<string, any>) =>
  commandRequest(data).then(() => {
    userStore.updateData();
  });
</script>

<template>
  <ButtonNormal class="mt-4" kind="action" @click="commandModalOpen = true">
    Unlock myself
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Unlock"
    :request="unlockRequest"
    :data="{ action: 'auth/unlock_myself' }"
  >
    If the unlock request completes successfully this modal will close and you
    will be able to do everything again.
  </ModalConfirm>
</template>
