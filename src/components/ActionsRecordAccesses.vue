<template>
  <ModalForm
    v-model="createRecordAccessModalOpen"
    title="Request Access"
    :fields="[
      {
        label: 'Explanation',
        name: 'explanation',
        type: 'textarea',
        required: false,
      },
    ]"
    :initial="{
      record: temporary?.id,
      requested_by: userStore.user?.user_id,
    }"
    :request="createRecordAccessRequest"
    submit="Request Access"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import RecordsService from "@/services/records";
import { useUserStore } from "@/store/user";
import { ModalForm } from "@lawandorga/components";

// store
const userStore = useUserStore();

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

// create
const {
  commandRequest: createRecordAccessRequest,
  commandModalOpen: createRecordAccessModalOpen,
  temporary,
} = useCommand(RecordsService.createRecordAccess, query.value);

// expose
defineExpose({
  temporary,
  createRecordAccessModalOpen,
});
</script>
