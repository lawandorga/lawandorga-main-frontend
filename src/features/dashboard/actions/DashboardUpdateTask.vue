<template>
  <!-- Things that should be editable: -->
  <!-- Title -->
  <!-- Notes -->
  <!-- Assignee -->
  <!-- <ModalUpdate
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
    /> -->
  <ModalFree title="" />
  <!-- TODO: Button to save -->
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, ModalFree } from "lorga-ui";
import { toRefs } from "vue";

// TODO:
// Figure out what modal to use (do we have to write our own?)
// Figure out opening of the modal from a different file

const props = defineProps<{
  query: () => void;
  title: string;
  url: string;
  dueDate: Date;
  creator: string;
  creationDate: Date;
  assignee: string;
  description: string;
  closeTask: () => void;
}>();
const {
  query,
  title,
  url,
  dueDate,
  creator,
  creationDate,
  assignee,
  description,
  closeTask,
} = toRefs(props);

// const noteFields: types.FormField[] = [
//   {
//     label: "Title",
//     name: "title",
//     required: true,
//     type: "text",
//     disabled: true,
//     // placeholder: title.value,
//     value: title.value,
//   },
//   { label: "Note", name: "note", required: true, type: "textarea" },
// ];

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
