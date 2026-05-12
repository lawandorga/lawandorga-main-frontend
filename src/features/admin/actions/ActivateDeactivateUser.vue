<script setup lang="ts">
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  userId: number;
  query: () => void;
  userActive: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal size="xs" kind="delete" @click="commandModalOpen = true">
    {{ userActive ? "Deactivate" : "Activate" }}
    <ModalConfirm
      v-model="commandModalOpen"
      :title="userActive ? 'Deactivate User' : 'Activate User'"
      :request="commandRequest"
      :data="{
        other_user_id: userId,
        action: 'auth/activate_user',
      }"
    >
      Are you sure you want to {{ userActive ? "deactivate" : "activate" }} user
      '{{ userName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>
