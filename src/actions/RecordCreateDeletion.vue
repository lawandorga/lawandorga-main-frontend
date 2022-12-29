<template>
  <ButtonNormal kind="delete" @click="createDeletionRequestModalOpen = true">
    Request Deletion
  </ButtonNormal>
  <ModalForm
    v-model="createDeletionRequestModalOpen"
    title="Request Deletion"
    :fields="[
      {
        label: 'Explanation',
        name: 'explanation',
        type: 'textarea',
        required: true,
      },
    ]"
    :initial="{
      record: recordId,
    }"
    :request="createDeletionRequestRequest"
    submit="Request Deletion"
  />
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalForm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import axios from "axios";

// props
const props = defineProps<{
  query: () => void;
  recordId: number;
}>();
const { query, recordId } = toRefs(props);

// request
function createDeletionRequest(data: {
  record: number;
  explanation: string;
}): Promise<void> {
  return axios.post("/records/deletions/", data).then();
}
// create
const {
  commandRequest: createDeletionRequestRequest,
  commandModalOpen: createDeletionRequestModalOpen,
  temporary,
} = useCommand(createDeletionRequest, query.value);

// expose
defineExpose({
  temporary,
  createDeletionRequestModalOpen,
});
</script>
