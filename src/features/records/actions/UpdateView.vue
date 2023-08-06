<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  viewUuid: string;
  viewName: string;
  viewOrdering: number;
  viewColumns: string[];
}>();
const { query, viewUuid } = toRefs(props);

const client = useClient();
const request = client.put("api/records/v2/settings/{}/", viewUuid);

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

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
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
    :data="{ name: viewName, columns: viewColumns, ordering: viewOrdering }"
  />
</template>
