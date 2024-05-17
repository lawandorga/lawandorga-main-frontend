<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    required: true,
  },
  {
    label: "Address Line 1",
    name: "address_line_1",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 2",
    name: "address_line_2",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 3",
    name: "address_line_3",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 4",
    name: "address_line_4",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 5",
    name: "address_line_5",
    type: "text",
    required: false,
  },
  {
    label: "Text Right",
    name: "text_right",
    type: "textarea",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Letterhead
    <ModalForm
      v-model="commandModalOpen"
      title="Create Letterhead"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="{ action: 'collab/create_letterhead' }"
    />
  </ButtonNormal>
</template>
