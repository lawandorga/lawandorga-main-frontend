<template>
  <ButtonNormal kind="delete" @click="deleteModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteModalOpen"
      title="Delete folder"
      :request="deleteRequest"
      :data="{ uuid: folderUuid, name: folderName }"
    >
      Are you sure you want to delete '{{ folderName }}'? This will delete all
      subfolders and the content.
    </ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersDeleteFolder } from "@/services/folders";
import { ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";
import { ButtonNormal } from "@lawandorga/components";

const props = defineProps<{
  folderUuid: string;
  folderName: string;
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest: deleteRequest, commandModalOpen: deleteModalOpen } =
  useCommand(foldersDeleteFolder, query.value);
</script>
