<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  footerName: string;
  footerDescription: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
    value: "test",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    value: "ABC",
    required: true,
  },
  {
    label: "Column 1",
    name: "column_1",
    type: "text",
    required: false,
  },
  {
    label: "Column 2",
    name: "column_2",
    type: "text",
    required: false,
  },
  {
    label: "Column 3",
    name: "column_3",
    type: "text",
    required: false,
  },
  {
    label: "Column 4",
    name: "column_4",
    type: "text",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Edit Footer
    <ModalUpdate
      v-model="commandModalOpen"
      title="Edit Footer"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'collab/update_footer',
        name: footerName,
        description: footerDescription,
      }"
    />
  </ButtonNormal>
</template>
