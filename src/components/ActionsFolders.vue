<template>
  <ModalCreate
    v-model="createModalOpen"
    :fields="fields"
    :request="createRequest"
    :initial="{ parent: parent }"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    :request="deleteRequest"
    :object="temporary"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";
import { listFolders, createFolder, deleteFolder } from "@/services/folders";
import { IFolderTree } from "@/types/folders";
import { ModalCreate, ModalDelete, types } from "@lawandorga/components";
import { ref } from "vue";

defineProps<{ parent: string | null }>();

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

const folders = ref<IFolderTree | null>(null);

useGet(listFolders, folders);

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(createFolder, useQuery(listFolders, folders));

const {
  commandRequest: deleteRequest,
  commandModalOpen: deleteModalOpen,
  temporary,
} = useCommand(deleteFolder, useQuery(listFolders, folders));

defineExpose({
  deleteModalOpen,
  temporary,
  createModalOpen,
  folders,
});
</script>
