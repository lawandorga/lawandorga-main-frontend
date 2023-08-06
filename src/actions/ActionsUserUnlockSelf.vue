<template>
  <ButtonNormal class="mt-4" kind="action" @click="commandModalOpen = true">
    Unlock myself
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Unlock"
    :request="unlockRequest"
  >
    If the unlock request completes successfully this modal will close and you
    will be able to do everything again.
  </ModalConfirm>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalConfirm, types } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const client = useClient();
const request = client.post("api/rlc_users/unlock_self/");

const { commandRequest, commandModalOpen } = useCommand(request);

const unlockRequest = (data: Record<string, any>) =>
  commandRequest(data).then(() => {
    userStore.updateData();
  });
</script>
