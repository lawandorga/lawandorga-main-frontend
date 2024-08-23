<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Note
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Note"
      :fields="noteFields"
      submit="Create"
      :request="commandRequest"
      :data="{
        action: 'org/create_note',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const noteFields: types.FormField[] = [
  { label: "Title", name: "title", required: true, type: "text" },
  { label: "Note", name: "note", required: true, type: "textarea" },
];

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
