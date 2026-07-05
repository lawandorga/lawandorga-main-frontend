<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  collabUuid: string;
  collabName: string;
  onDelete?: () => void;
}>();
const { query, collabUuid, collabName, onDelete } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(
  query,
  onDelete.value ? onDelete.value : () => {},
);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Collab Document"
    :request="commandRequest"
    :data="{ action: 'collab/delete_collab', collab_uuid: collabUuid }"
    :obj-name="collabName"
  />
</template>
