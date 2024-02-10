<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete View
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete View"
    :request="commandRequest"
    :data="{ uuid: viewUuid, action: 'records/delete_view' }"
    :obj-name="viewName"
  />
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";

defineProps<{
  query: () => void;
  viewUuid: string;
  viewName: string;
}>();

const { commandRequest, commandModalOpen } = useCmd(() =>
  window.location.reload(),
);
</script>
