<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  viewUuid: string;
  viewName: string;
  viewOrdering: number;
  viewColumns: string[];
}>();
const { query, viewUuid } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Columns",
    type: "list",
    name: "columns",
    required: true,
    helptext:
      "The name of the columns must match with names of the fields in the data sheet templates. The matching is case sensitive.",
  },
  {
    label: "Ordering",
    name: "ordering",
    type: "number",
    required: true,
    helptext: "Views with lower numbers will be shown first, like 1 -> 2 -> 3.",
  },
];

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update View
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Update View"
    :request="commandRequest"
    :data="{
      uuid: viewUuid,
      name: viewName,
      columns: viewColumns,
      ordering: viewOrdering,
      action: 'records/update_view',
    }"
  />
</template>
