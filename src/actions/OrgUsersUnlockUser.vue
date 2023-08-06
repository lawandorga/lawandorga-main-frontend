<template>
  <ButtonNormal
    v-if="userLocked"
    kind="action"
    @click="unlockUserModalOpen = true"
  >
    Unlock
    <ModalDelete
      v-model="unlockUserModalOpen"
      title="Unlock User"
      :request="unlockUserRequest"
      :data="{ id: userId }"
      verb="unlock"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{
  userId: number;
  query: () => void;
  userLocked: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const client = useClient();

const request = client.post("api/rlc_users/{}/unlock_user/", userId);

const {
  commandRequest: unlockUserRequest,
  commandModalOpen: unlockUserModalOpen,
} = useCommand(request, query.value);
</script>
