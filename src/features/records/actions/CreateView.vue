<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

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

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create View
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    title="Create View"
    :fields="fields"
    :request="commandRequest"
    :data="{ action: 'records/create_view' }"
  />
</template>
