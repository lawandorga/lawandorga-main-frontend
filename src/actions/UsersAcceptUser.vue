<template>
  <ButtonNormal
    v-if="!userAccepted"
    kind="action"
    @click="acceptUserModalOpen = true"
  >
    Accept
    <ModalConfirm
      v-model="acceptUserModalOpen"
      title="Accept User"
      :request="acceptUserRequest"
      :data="{ user: userId }"
    >
      Are your sure you want to accept '{{ userName }}'?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { ModalConfirm, ButtonNormal } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{
  userId: number;
  query: () => void;
  userAccepted: boolean;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const client = useClient();

const request = client.post("api/org/accept_member/");

const {
  commandRequest: acceptUserRequest,
  commandModalOpen: acceptUserModalOpen,
} = useCommand(request, query.value);
</script>
