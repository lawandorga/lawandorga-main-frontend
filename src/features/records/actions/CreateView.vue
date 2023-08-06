<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create View
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create View"
    :fields="fields"
    :request="commandRequest"
  />
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const client = useClient();
const request = client.post("api/records/v2/settings/");

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
    label: "Shared",
    name: "shared",
    type: "toggle",
    helptext:
      "If the view is shared, it will be available for all users of the organization.",
  },
];

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
