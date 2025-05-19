<script setup lang="ts">
import useCmd from "@/composables/useCmd";
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

const { commandRequest, commandModalOpen: createModalOpen } = useCmd(
  query.value,
);

defineExpose({
  createModalOpen,
});
</script>

<template>
  <ButtonNormal kind="action" @click="createModalOpen = true">
    Add Subfolder
    <ModalCreate
      v-model="createModalOpen"
      title="Create Folder"
      :fields="fields"
      :request="commandRequest"
      :data="{ parent: parent, action: 'folders/create_folder' }"
    />
  </ButtonNormal>
</template>
