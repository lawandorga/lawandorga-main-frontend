<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Request Deletion
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    title="Request Deletion"
    :fields="[
      {
        label: 'Explanation',
        name: 'explanation',
        type: 'textarea',
        required: false,
      },
    ]"
    :data="{
      action: 'records/create_deletion_request',
      record_uuid: recordUuid,
    }"
    :request="commandRequest"
    submit="Request Deletion"
  />
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalForm } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  recordUuid: string;
}>();
const { query, recordUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
