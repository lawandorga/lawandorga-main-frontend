<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change Name
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change Name"
      submit="Save"
      :fields="fields"
      :request="commandRequest"
      :data="{ name, id }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { recordsChangeName } from "@/services/records";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

// props
const props = defineProps<{ name: string; id: number; query: () => void }>();
const { query } = toRefs(props);

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
