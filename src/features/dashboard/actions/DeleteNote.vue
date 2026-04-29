<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  noteId: number;
  noteTitle: string;
}>();
const { query, noteId } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true" class="pl-2">
    <TrashIcon class="w-4 h-4 stroke-2" />
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Delete Note"
      :data="{ note_id: noteId, action: 'org/delete_note' }"
      :obj-name="noteTitle"
    />
  </ButtonNormal>
</template>
