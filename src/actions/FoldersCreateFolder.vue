<template>
  <ButtonNormal kind="action" @click="createModalOpen = true">
    Add Subfolder
    <ModalCreate
      v-model="createModalOpen"
      title="Create Folder"
      :fields="fields"
      :request="createRequest"
      :data="{ parent: parent }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersCreateFolder } from "@/services/folders";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  parent: string | null;
  query: () => void;
}>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(foldersCreateFolder, query.value);

defineExpose({
  createModalOpen,
});
</script>
