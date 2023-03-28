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
import { RecordTemplate } from "@/types/records";
import { ButtonNormal, ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

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
}>("api/records/records/v2/within_folder/");

const {
  commandRequest: createWithinFolderRequest,
  commandModalOpen: createWithinFolderModalOpen,
} = useCommand(request, query.value);

const availableTemplates = ref<RecordTemplate[]>([]);

const templateRequest = client.get("api/records/query/templates/");
const getTemplates = useQuery(templateRequest, availableTemplates);

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
    options: availableTemplates.value,
  },
]);

defineExpose({
  createWithinFolderModalOpen,
});
</script>
