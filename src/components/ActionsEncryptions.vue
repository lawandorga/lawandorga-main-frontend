<template>
  <ModalDelete
    v-model="deleteModalOpen"
    :object="temporary"
    :request="deleteRequest"
    title="Delete Encryption Keys"
  >
    Are you sure you want to delete these keys?
  </ModalDelete>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import RecordsService from "@/services/records";
import useGet from "@/composables/useGet";
import useDelete from "@/composables/useDelete";
import { Record, RecordEncryption } from "@/types/records";
import { ModalDelete } from "@lawandorga/components";

// props
const props = defineProps<{ record: Record | null }>();

const { record } = toRefs(props);

// get
const encryptions = ref<null | RecordEncryption[]>(null);

useGet(RecordsService.getEncryptions, encryptions, record);

// delete
const temporary = ref<null | RecordEncryption>(null);

const { deleteRequest, deleteModalOpen } = useDelete(
  RecordsService.deleteEncryption,
  encryptions,
);

// expose
defineExpose({
  encryptions,
  temporary,
  deleteModalOpen,
});
</script>
