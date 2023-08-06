<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Template
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Template"
      :fields="createFields"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const createFields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
];

const client = useClient();

const create = client.post("api/records/templates/");

const { commandRequest, commandModalOpen } = useCommand(create, query.value);
</script>
