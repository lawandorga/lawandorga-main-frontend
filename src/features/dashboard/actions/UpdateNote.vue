<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
    <ModalUpdate
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Update Note"
      width="max-w-3xl"
      :fields="noteFields"
      :data="{
        note_id: noteId,
        title: noteTitle,
        note: noteNote,
        order: noteOrder,
        action: 'org/update_note',
      }"
    >
      <template #custom="{ data }">
        <FormWysiwyg v-model="data.note" required label="Description" />
      </template>
    </ModalUpdate>
  </ButtonNormal>
</template>

<script setup lang="ts">
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  noteId: number;
  noteTitle: string;
  noteNote: string;
  noteOrder: number;
}>();
const { query, noteId } = toRefs(props);

const noteFields: types.FormField[] = [
  { label: "Title", name: "title", required: true, type: "text" },
  {
    name: "custom",
    type: "slot",
  },
  {
    label: "Order",
    name: "order",
    required: true,
    type: "number",
    helptext: "The highest number will be first.",
  },
];

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
