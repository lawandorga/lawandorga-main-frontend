<template>
  <ButtonNormal kind="action" @click="createWithinFolderModalOpen = true">
    Create Data Sheet
    <ModalForm
      v-model="createWithinFolderModalOpen"
      title="Create Data Sheet"
      :fields="createWithinFolderFields"
      :request="createWithinFolderRequest"
      submit="Create"
      :data="{ folder: folderUuid }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";
import useClient from "@/api/client";
import { useTemplates } from "../api/useTemplates";

// props
const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query } = toRefs(props);

// create within folder
const client = useClient();
const request = client.post<{
  name: string;
  folder: string;
  template: number;
}>("api/data_sheets/data_sheets/within_folder/");

const {
  commandRequest: createWithinFolderRequest,
  commandModalOpen: createWithinFolderModalOpen,
} = useCommand(request, query.value);

const { templates: availableTemplates, query: getTemplates } = useTemplates();

watch(createWithinFolderModalOpen, (newValue) => {
  if (newValue) {
    getTemplates();
  }
});

const createWithinFolderFields = computed<types.FormField[]>(() => [
  {
    label: "Folder",
    type: "hidden",
    name: "folder",
    required: true,
  },
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Template",
    type: "select",
    name: "template",
    required: true,
    options: availableTemplates.value || [],
  },
]);

defineExpose({
  createWithinFolderModalOpen,
});
</script>
