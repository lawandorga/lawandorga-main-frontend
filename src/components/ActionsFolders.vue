<template>
  <ModalCreate
    v-model="createModalOpen"
    :fields="fields"
    :request="createRequest"
    :initial="{ parent: parent }"
  />
  {{ parent || "null" }}
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";
import { listFolders, createFolder } from "@/services/folders";
import { IFolderTree } from "@/types/folders";
import { ModalCreate, types } from "@lawandorga/components";
import { ref } from "vue";

defineProps<{ parent: string | null }>();

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text" },
];

const folders = ref<IFolderTree | null>(null);

useGet(listFolders, folders);

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(createFolder, useQuery(listFolders, folders));

defineExpose({
  createModalOpen,
  folders,
});
</script>
