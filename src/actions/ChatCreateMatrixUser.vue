<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Chat User
    <ModalConfirm
      v-model="commandModalOpen"
      title="Create Chat User"
      :request="commandRequest"
    >
      Are you sure you want to create a chat user?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();

const { query } = toRefs(props);
const client = useClient();

const request = client.post("api/matrix_users/");
const { commandModalOpen, commandRequest } = useCommand(request, query.value);
</script>
