<template>
  <ModalForm
    v-model="createModalOpen"
    title="Create Record"
    :fields="createFields"
    :request="createRequest"
    submit="Create"
    @success="recordCreated($event)"
  />
  <ModalForm
    v-model="createWithinFolderModalOpen"
    title="Create Record"
    :fields="createWithinFolderFields"
    :request="createWithinFolderRequest"
    submit="Create"
    :data="temporary"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { RecordTemplate, Record } from "@/types/records";
import { ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import RecordsService, { recordsCreateRecord } from "@/services/records";
import useGet from "@/composables/useGet";
import { IAvailableFolder } from "@/types/folders";
import { foldersGetAvailableFolders } from "@/services/folders";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

//
const router = useRouter();

// create within folder
const {
  commandRequest: createWithinFolderRequest,
  commandModalOpen: createWithinFolderModalOpen,
  temporary,
} = useCommand(recordsCreateRecord, query.value);

// create within records folder
const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(RecordsService.createRecord);

const recordCreated = (record: Record) => {
  router.push({
    name: "folders-detail",
    params: { uuid: record.folder_uuid, record: record.id },
  });
};

const availableFolders = ref<IAvailableFolder[]>([]);
const availableTemplates = ref<RecordTemplate[]>([]);

watch([createModalOpen, createWithinFolderModalOpen], () => {
  useGet(RecordsService.getTemplates, availableTemplates);
  useGet(foldersGetAvailableFolders, availableFolders);
});

const createFields = computed<types.FormField[]>(() => [
  {
    label: "Folder",
    type: "hidden",
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
  createModalOpen,
  createWithinFolderModalOpen,
  temporary,
});
</script>
