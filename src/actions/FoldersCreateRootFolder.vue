<template>
  <ButtonNormal kind="action" @click="createModalOpen = true">
    Create Root Folder
    <ModalCreate
      v-model="createModalOpen"
      title="Create Root Folder"
      :fields="fields"
      :request="createRequest"
      :data="{ parent: null }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersCreateFolder } from "@/services/folders";
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(foldersCreateFolder, query.value);
</script>
