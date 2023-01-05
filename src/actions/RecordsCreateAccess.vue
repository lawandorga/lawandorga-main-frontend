<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Request Access
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    title="Request Access"
    :fields="[
      {
        label: 'Explanation',
        name: 'explanation',
        type: 'textarea',
        required: true,
      },
    ]"
    :data="{
      record: recordId,
    }"
    :request="commandRequest"
    submit="Request Access"
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
  return axios.post("/records/accesses/", data).then();
}
// create
const { commandRequest, commandModalOpen } = useCommand(
  createDeletionRequest,
  query.value,
);
</script>
