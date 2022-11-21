<template>
  <ModalCreate
    v-model="createModalOpen"
    :fields="fields"
    :request="createRequest"
    :initial="{ parent: parent }"
  />
  <ModalUpdate
    v-model="updateModalOpen"
    title="Change name"
    :fields="fields"
    :request="updateRequest"
    :initial="temporary"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    title="Delete folder"
    :request="deleteRequest"
    :object="temporary"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  foldersCreateFolder,
  foldersDeleteFolder,
  foldersUpdateFolder,
} from "@/services/folders";
import {
  ModalCreate,
  ModalDelete,
  ModalUpdate,
  types,
} from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{ parent: string | null; query: () => void }>();
const { query } = toRefs(props);

// fields
const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

// create folder
const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(foldersCreateFolder, query.value);

// update folder
const { commandRequest: updateRequest, commandModalOpen: updateModalOpen } =
  useCommand(foldersUpdateFolder, query.value);

// delete folder
const {
  commandRequest: deleteRequest,
  commandModalOpen: deleteModalOpen,
  temporary,
} = useCommand(foldersDeleteFolder, query.value);

defineExpose({
  deleteModalOpen,
  temporary,
  createModalOpen,
  updateModalOpen,
});
</script>
