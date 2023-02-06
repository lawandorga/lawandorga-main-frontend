<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      :data="{ id: userId, name: userName }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  userId: number;
  query: () => void;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const client = useClient();

const request = client.delete("api/rlc_users/{}/", userId);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
