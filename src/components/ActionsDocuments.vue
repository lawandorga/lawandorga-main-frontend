<template>
  <ModalCreate
    v-model="createModalOpen"
    title="Upload Document"
    :fields="fields"
    :request="createRequest"
    :initial="{ record: $route.params.id }"
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
import { RecordsDocument } from "@/types/records";
import { ref, toRefs } from "vue";
import RecordsService from "@/services/records";
import useDelete from "@/composables/useDelete";
import useGet from "@/composables/useGet";
import useCreate from "@/composables/useCreate";
import { Record } from "@/types/records";

// props
const props = defineProps<{ record: Record | null }>();
const { record } = toRefs(props);

// documents
const documents = ref<null | RecordsDocument[]>(null);
useGet(RecordsService.getDocuments, documents, record);

// create
const fields = [
  {
    label: "File",
    type: "file",
    name: "file",
    required: true,
  },
] as types.FormField[];
const { createModalOpen, createRequest } = useCreate(
  RecordsService.createDocument,
  documents,
);

// download
const downloadDocument = RecordsService.downloadDocument;

// delete
const {
  deleteModalOpen: deleteModalOpen,
  deleteRequest,
  temporary,
} = useDelete(RecordsService.deleteDocument, documents);

// expose
defineExpose({
  documents,
  // upload
  createModalOpen,
  // download
  downloadDocument,
  // delete
  temporary,
  deleteModalOpen,
});
</script>
