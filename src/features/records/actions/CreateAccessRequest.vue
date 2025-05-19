<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalForm } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  recordUuid: string;
}>();
const { query, recordUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

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
      record_uuid: recordUuid,
      action: 'records/create_access_request',
    }"
    :request="commandRequest"
    submit="Request Access"
  />
</template>
