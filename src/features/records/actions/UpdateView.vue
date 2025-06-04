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
      shared: viewShared,
      action: 'records/update_view',
    }"
  />
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  viewUuid: string;
  viewName: string;
  viewOrdering: number;
  viewShared: boolean;
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
    label: "Shared",
    name: "shared",
    type: "toggle",
    helptext:
      "If the view is shared, it will be available for all users of the organization.",
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
