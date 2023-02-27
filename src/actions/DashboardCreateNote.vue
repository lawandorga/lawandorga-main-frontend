<template>
  <ButtonNormal kind="action" @click="createNoteModalOpen = true">
    Create Note
    <ModalCreate
      v-model="createNoteModalOpen"
      title="Create Note"
      :fields="noteFields"
      submit="Create"
      :request="createNoteRequest"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const noteFields: types.FormField[] = [
  { label: "Title", name: "title", required: true, type: "text" },
  { label: "Note", name: "note", required: true, type: "textarea" },
];

const client = useClient();
const request = client.post("api/notes/");

const {
  commandModalOpen: createNoteModalOpen,
  commandRequest: createNoteRequest,
} = useCommand(request, query.value);
</script>
