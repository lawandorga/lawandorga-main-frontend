<script setup lang="ts">
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const noteFields: types.FormField[] = [
  { label: "Title", name: "title", required: true, type: "text" },
  {
    name: "custom",
    type: "slot",
  },
  {
    label: "Order",
    name: "order",
    required: true,
    type: "number",
    helptext: "The highest number will be first.",
  },
];

const { commandModalOpen, commandRequest } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Note
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Note"
      :fields="noteFields"
      submit="Create"
      width="max-w-3xl"
      :request="commandRequest"
      :data="{
        action: 'org/create_note',
      }"
    >
      <template #custom="{ data }">
        <FormWysiwyg v-model="data.note" required label="Description" />
      </template>
    </ModalCreate>
  </ButtonNormal>
</template>
