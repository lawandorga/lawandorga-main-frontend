<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";

const props = defineProps<{
  query: () => void;
  keyId: number;
}>();

const { commandRequest, commandModalOpen } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    :request="commandRequest"
    :data="{
      key_id: keyId,
      action: 'auth/delete_key',
    }"
  />
</template>
