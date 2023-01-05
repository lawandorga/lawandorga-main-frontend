<template>
  <ModalForm
    v-model="createWithinFolderModalOpen"
    title="Create Record"
    :fields="createWithinFolderFields"
    :request="createWithinFolderRequest"
    submit="Create"
    :data="{ folder: folderUuid }"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { RecordTemplate } from "@/types/records";
import { ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import RecordsService, {
  recordsCreateRecordWithinFolder,
} from "@/services/records";
import useGet from "@/composables/useGet";
import { IAvailableFolder } from "@/types/folders";
import { foldersGetAvailableFolders } from "@/services/folders";

// props
const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query } = toRefs(props);

// create within folder
const {
  commandRequest: createWithinFolderRequest,
  commandModalOpen: createWithinFolderModalOpen,
} = useCommand(recordsCreateRecordWithinFolder, query.value);

const availableFolders = ref<IAvailableFolder[]>([]);
const availableTemplates = ref<RecordTemplate[]>([]);

watch(createWithinFolderModalOpen, (newValue) => {
  if (newValue) {
    useGet(RecordsService.getTemplates, availableTemplates);
    useGet(foldersGetAvailableFolders, availableFolders);
  }
});

const createWithinFolderFields = computed<types.FormField[]>(() => [
  {
    label: "Folder",
    type: "select",
    name: "folder",
    required: true,
    options: availableFolders.value,
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
