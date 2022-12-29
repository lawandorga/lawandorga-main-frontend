<template>
  <ModalCreate
    v-model="createModalOpen"
    title="Create Folder"
    :fields="fields"
    :request="createRequest"
    :initial="{ parent: parent }"
  />
  <ModalUpdate
    v-model="updateModalOpen"
    title="Change name"
    :fields="fields"
    :request="updateRequest"
    :initial="{ uuid: temporary?.folder?.uuid, name: temporary?.folder?.name }"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    title="Delete folder"
    :request="deleteRequest"
    :object="{ uuid: temporary?.folder?.uuid, name: temporary?.folder?.name }"
  >
    Are you sure you want to delete '{{ temporary?.folder?.name }}'? This will
    delete all subfolders and the content.
  </ModalDelete>
  <ModalUpdate
    v-model="grantAccessModalOpen"
    title="Grant access"
    :fields="grantAccessFields"
    :request="grantAccessRequest"
    :initial="{ uuid: temporary?.folder?.uuid }"
  />
  <ModalUpdate
    v-model="revokeAccessModalOpen"
    title="Revoke access"
    :fields="revokeAccessFields"
    :request="revokeAccessRequest"
    :initial="temporary"
  />
  <ModalConfirm
    v-model="toggleInheritanceModalOpen"
    title="Toggle inheritance"
    :request="toggleInheritanceRequest"
    :data="{ folder: temporary?.folder?.uuid }"
  >
    Are you sure you want to toggle the inheritance of '{{
      temporary?.folder?.name
    }}'?
  </ModalConfirm>
  <ModalUpdate
    v-model="moveFolderModalOpen"
    title="Move folder"
    :fields="moveFolderFields"
    :request="moveFolderRequest"
    :initial="{ folder: temporary?.folder?.uuid }"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  foldersCreateFolder,
  foldersDeleteFolder,
  foldersGrantAccess,
  foldersMoveFolder,
  foldersRevokeAccess,
  foldersToggleInheritance,
  foldersUpdateFolder,
} from "@/services/folders";
import { IAccess, IFolder } from "@/types/folders";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  ModalUpdate,
  types,
} from "@lawandorga/components";
import { computed, toRefs } from "vue";

const props = defineProps<{
  parent: string | null;
  query: () => void;
  availablePersons: IAccess[] | null;
  availableFolders: IFolder[] | null;
}>();
const { query, availablePersons, availableFolders } = toRefs(props);

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

// revoke access
const revokeAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "user_uuid",
      type: "select",
      required: true,
      options: temporary.value ? temporary.value.access : [],
    },
  ] as types.FormField[];
});
const {
  commandRequest: revokeAccessRequest,
  commandModalOpen: revokeAccessModalOpen,
} = useCommand(foldersRevokeAccess, query.value);

// grant access
const grantAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "user_uuid",
      type: "select",
      required: true,
      options: availablePersons.value ? availablePersons.value : [],
    },
  ] as types.FormField[];
});
const {
  commandRequest: grantAccessRequest,
  commandModalOpen: grantAccessModalOpen,
} = useCommand(foldersGrantAccess, query.value);

// move
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
const {
  commandRequest: moveFolderRequest,
  commandModalOpen: moveFolderModalOpen,
} = useCommand(foldersMoveFolder, query.value);

// toggle inheritance
const {
  commandRequest: toggleInheritanceRequest,
  commandModalOpen: toggleInheritanceModalOpen,
} = useCommand(foldersToggleInheritance, query.value);

// expose
defineExpose({
  deleteModalOpen,
  revokeAccessModalOpen,
  grantAccessModalOpen,
  toggleInheritanceModalOpen,
  temporary,
  createModalOpen,
  updateModalOpen,
  moveFolderModalOpen,
});
</script>
