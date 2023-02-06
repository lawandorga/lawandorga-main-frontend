<template>
  <ButtonNormal size="xs" kind="action" @click="commandModalOpen = true">
    Create Group
    <ModalCreate
      v-model="commandModalOpen"
      :fields="fields"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import useClient from "@/api/client";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Description",
    type: "textarea",
    name: "description",
    required: false,
  },
];

const client = useClient();
const request = client.post("api/groups/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
