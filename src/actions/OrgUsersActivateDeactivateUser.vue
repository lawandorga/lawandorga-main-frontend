<template>
  <ButtonNormal size="xs" kind="delete" @click="activateUserModalOpen = true">
    {{ userActive ? "Deactivate" : "Activate" }}
    <ModalConfirm
      v-model="activateUserModalOpen"
      :title="userActive ? 'Deactivate User' : 'Activate User'"
      :request="activateUserRequest"
      :data="{ is_active: !userActive }"
    >
      Are you sure you want to {{ userActive ? "deactivate" : "activate" }} user
      '{{ userName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalConfirm } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  userId: number;
  query: () => void;
  userActive: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const client = useClient();

const request = client.put("api/rlc_users/{}/activate/", userId);

const {
  commandRequest: activateUserRequest,
  commandModalOpen: activateUserModalOpen,
} = useCommand(request, query.value);
</script>
