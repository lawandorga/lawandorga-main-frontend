<template>
  <ButtonNormal kind="delete" @click="deleteNoteModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteNoteModalOpen"
      :request="deleteNoteRequest"
      :data="{ id: noteId, name: noteTitle }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  noteId: number;
  noteTitle: string;
}>();
const { query, noteId } = toRefs(props);

const client = useClient();
const request = client.delete("/api/notes/{}/", noteId);

const {
  commandModalOpen: deleteNoteModalOpen,
  commandRequest: deleteNoteRequest,
} = useCommand(request, query.value);
</script>
