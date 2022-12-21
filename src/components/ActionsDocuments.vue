<template>
  <ModalCreate
    v-model="createModalOpen"
    title="Upload Document"
    :fields="fields"
    :request="createRequest"
    :initial="{ record: $route.params.id, folder: folder?.folder.uuid }"
    submit="Upload"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    :object="temporary"
    :request="deleteRequest"
    title="Delete Document"
    @deleted="emit('deleted')"
  />
</template>

<script lang="ts" setup>
import { ModalDelete, ModalCreate, types } from "@lawandorga/components";
import { toRefs } from "vue";
import {
  filesDeleteFile,
  filesDownloadFileToMachine,
  filesNewUploadFile,
} from "@/services/files_new";
import useCommand from "@/composables/useCommand";
import { IFolderDetail } from "@/types/folders";

// emits
const emit = defineEmits(["deleted"]);

// props
const props = defineProps<{
  folder: IFolderDetail | null;
  query: () => void;
}>();
const { folder, query } = toRefs(props);

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
const downloadDocument = filesDownloadFileToMachine;

// delete
const {
  commandModalOpen: deleteModalOpen,
  commandRequest: deleteRequest,
  temporary,
} = useCommand(filesDeleteFile, query.value);

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
