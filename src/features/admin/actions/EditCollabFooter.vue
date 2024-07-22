<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { Footer } from "../api/useFooter";

const props = defineProps<{
  query: () => void;
  footer: Footer;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
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
        footer_uuid: footer.uuid,
        column_1: footer.column_1,
        column_2: footer.column_2,
        column_3: footer.column_3,
        column_4: footer.column_4,
      }"
    />
  </ButtonNormal>
</template>
