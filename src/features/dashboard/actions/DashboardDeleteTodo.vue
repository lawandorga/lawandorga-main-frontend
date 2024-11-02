<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Delete Note"
      :data="{ note_id: noteId, action: 'org/delete_note' }"
      :obj-name="noteTitle"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  noteId: number;
  noteTitle: string;
}>();
const { query, noteId } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
