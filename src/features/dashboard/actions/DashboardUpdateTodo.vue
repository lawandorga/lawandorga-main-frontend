<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Mark as done
    <ModalUpdate
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Update Note"
      :fields="noteFields"
      :data="{
        note_id: noteId,
        title: noteTitle,
        note: noteNote,
        action: 'org/update_note',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
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

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
