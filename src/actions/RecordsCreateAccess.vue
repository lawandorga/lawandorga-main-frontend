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
        required: false,
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
import useClient from "@/api/client";

// props
const props = defineProps<{
  query: () => void;
  recordId: number;
}>();
const { query, recordId } = toRefs(props);

// request
const client = useClient();
const request = client.post("/api/records/accesses/");

// create
const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
