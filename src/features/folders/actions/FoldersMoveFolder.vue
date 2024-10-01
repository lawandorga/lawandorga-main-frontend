<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Move
    <ModalUpdate
      v-model="commandModalOpen"
      title="Move Folder"
      :fields="moveFolderFields"
      :request="commandRequest"
      :data="{ folder_uuid: folderUuid, action: 'folders/move_folder' }"
      submit="Move"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { Folder } from "../api/useFolderPage";

const props = defineProps<{
  query: () => void;
  availableFolders: Folder[];
  folderUuid: string;
}>();

const { query, availableFolders } = toRefs(props);

const moveFolderFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Target folder",
      name: "target_uuid",
      type: "select",
      required: true,
      options: availableFolders.value,
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
