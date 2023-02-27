<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
    <ModalUpdate
      v-model="commandModalOpen"
      :request="commandRequest"
      :fields="noteFields"
      :data="{ id: noteId, title: noteTitle, note: noteNote }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  noteId: number;
  noteTitle: string;
  noteNote: string;
}>();
const { query, noteId } = toRefs(props);

const noteFields: types.FormField[] = [
  { label: "Title", name: "title", required: true, type: "text" },
  { label: "Note", name: "note", required: true, type: "textarea" },
];

const client = useClient();
const request = client.put("/api/notes/{}/", noteId);

const { commandModalOpen, commandRequest } = useCommand(request, query.value);
</script>
