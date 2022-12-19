<template>
  <ModalUpdate
    v-model="commandModalOpen"
    title="Change domain"
    submit="Save"
    :fields="fields"
    :request="commandRequest"
    :initial="record"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { recordsChangeName } from "@/services/records";
import { Record } from "@/types/records";
import { ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

// props
const props = defineProps<{ record: Record | null; query: () => void }>();
const { record, query } = toRefs(props);

// change name
const fields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCommand(
  recordsChangeName,
  query.value,
);

// expose
defineExpose({
  commandModalOpen,
});
</script>
