<template>
  <ModalCreate
    v-model="createModalOpen"
    title="Upload Document"
    :fields="fields"
    :request="createRequest"
    :initial="{ record: $route.params.id, folder: record?.folder_uuid }"
    submit="Upload"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    :object="temporary"
    :request="deleteRequest"
    title="Delete Document"
  />
</template>

<script lang="ts" setup>
import { ModalDelete, ModalCreate, types } from "@lawandorga/components";
import { toRefs } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import { filesNewUploadFile } from "@/services/files_new";
import useCommand from "@/composables/useCommand";

// props
const props = defineProps<{ record: Record | null; query: () => void }>();
const { record, query } = toRefs(props);

// create
const fields = [
  {
    label: "File",
    type: "file",
    name: "file",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen: createModalOpen, commandRequest: createRequest } =
  useCommand(filesNewUploadFile, query.value);

// download
const downloadDocument = RecordsService.downloadDocument;

// delete
const {
  commandModalOpen: deleteModalOpen,
  commandRequest: deleteRequest,
  temporary,
} = useCommand(RecordsService.deleteDocument, query.value);

// expose
defineExpose({
  // upload
  createModalOpen,
  // download
  downloadDocument,
  // delete
  temporary,
  deleteModalOpen,
});
</script>
