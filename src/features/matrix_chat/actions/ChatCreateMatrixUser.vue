<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Chat User
    <ModalConfirm
      v-model="commandModalOpen"
      title="Create Chat User"
      :request="commandRequest"
      :data="{
        action: 'auth/create_matrix_user',
      }"
    >
      Are you sure you want to create a chat user?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();

const { query } = toRefs(props);
const { commandModalOpen, commandRequest } = useCmd(query);
</script>
