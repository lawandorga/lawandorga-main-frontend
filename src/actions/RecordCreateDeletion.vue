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
    :data="{
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
import useClient from "@/api/client";

// props
const props = defineProps<{
  query: () => void;
  recordId: number;
}>();
const { query, recordId } = toRefs(props);

// request
const client = useClient();
const request = client.post("/api/records/deletions/");

// create
const {
  commandRequest: createDeletionRequestRequest,
  commandModalOpen: createDeletionRequestModalOpen,
  temporary,
} = useCommand(request, query.value);

// expose
defineExpose({
  temporary,
  createDeletionRequestModalOpen,
});
</script>
