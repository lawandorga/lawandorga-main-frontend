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
    :object="{ id: temporary?.folder?.id, name: temporary?.folder?.name }"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    title="Delete folder"
    :request="deleteRequest"
    :object="{ id: temporary?.folder?.id, name: temporary?.folder?.name }"
  />
  <ModalUpdate
    v-model="grantAccessModalOpen"
    title="Grant access"
    :fields="grantAccessFields"
    :request="grantAccessRequest"
    :initial="{ id: temporary?.folder?.id }"
  />
  <ModalUpdate
    v-model="revokeAccessModalOpen"
    title="Revoke access"
    :fields="revokeAccessFields"
    :request="revokeAccessRequest"
    :initial="{ id: temporary?.folder?.id }"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  foldersCreateFolder,
  foldersDeleteFolder,
  foldersGrantAccess,
  foldersRevokeAccess,
  foldersUpdateFolder,
} from "@/services/folders";
import { IAccess } from "@/types/folders";
import {
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
}>();
const { query, availablePersons } = toRefs(props);

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
      options: temporary.value
        ? temporary.value.access.map((i: IAccess) => ({ ...i, id: i.slug }))
        : [],
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
      options: availablePersons.value
        ? availablePersons.value.map((i: IAccess) => ({ ...i, id: i.slug }))
        : [],
    },
  ] as types.FormField[];
});
const {
  commandRequest: grantAccessRequest,
  commandModalOpen: grantAccessModalOpen,
} = useCommand(foldersGrantAccess, query.value);

defineExpose({
  deleteModalOpen,
  revokeAccessModalOpen,
  grantAccessModalOpen,
  temporary,
  createModalOpen,
  updateModalOpen,
});
</script>
