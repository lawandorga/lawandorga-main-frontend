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
      record_uuid: recordUuid,
    }"
    :request="commandRequest"
    submit="Request Deletion"
  />
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalForm } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  recordUuid: string;
}>();
const { query, recordUuid } = toRefs(props);

const client = useClient();
const request = client.post("/api/records/v2/deletions/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
