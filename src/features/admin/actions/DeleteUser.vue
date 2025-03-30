<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      :data="{ other_user_id: userId, action: 'auth/delete_user' }"
      :obj-name="userName"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  userId: number;
  query: () => void;
  userName: string;
}>();
const { userId, query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
