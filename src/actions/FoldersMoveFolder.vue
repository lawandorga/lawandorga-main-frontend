<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Move
    <ModalUpdate
      v-model="commandModalOpen"
      title="Move folder"
      :fields="moveFolderFields"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Move"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersMoveFolder } from "@/services/folders";
import { IFolder } from "@/types/folders";
import { ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { ButtonNormal } from "lorga-ui";

const props = defineProps<{
  query: () => void;
  availableFolders: IFolder[];
  folderUuid: string;
}>();

const { query, availableFolders } = toRefs(props);

const moveFolderFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Target folder",
      name: "target",
      type: "select",
      required: true,
      options: availableFolders.value,
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCommand(
  foldersMoveFolder,
  query.value,
);
</script>
