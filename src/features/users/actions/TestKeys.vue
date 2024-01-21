<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalConfirm } from "lorga-ui";

const props = defineProps<{
  query: () => void;
}>();

const { commandRequest, commandModalOpen } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Test all keys
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    :request="commandRequest"
    :data="{
      action: 'auth/test_keys',
    }"
    title="Test All Keys"
  >
    Please, press the confirm button to test all keys. This might take up to a
    minute.
  </ModalConfirm>
</template>
