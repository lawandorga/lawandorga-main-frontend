<template>
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
      record: temporary?.id,
    }"
    :request="createDeletionRequestRequest"
    submit="Request Deletion"
  />
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import RecordsService from "@/services/records";
import { ModalForm } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

// create
const {
  commandRequest: createDeletionRequestRequest,
  commandModalOpen: createDeletionRequestModalOpen,
  temporary,
} = useCommand(RecordsService.createDeletionRequest, query.value);

// expose
defineExpose({
  temporary,
  createDeletionRequestModalOpen,
});
</script>
