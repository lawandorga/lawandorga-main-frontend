<script setup lang="ts">
import { toRefs } from "vue";
import { ModalFree, FormGenerator, ButtonNormal } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{ templateId: number; query: () => void }>();
const { query } = toRefs(props);

const createFields = [
  {
    label: "Kind",
    name: "kind",
    type: "select",
    options: [
      { name: "Standard", value: "standard" },
      { name: "Select", value: "select" },
      { name: "Multiple", value: "multiple" },
      { name: "State", value: "state" },
      { name: "Users", value: "users" },
      {
        name: "Encrypted Standard",
        value: "encryptedstandard",
      },
      {
        name: "Encrypted Select",
        value: "encryptedselect",
      },
      {
        name: "Encrypted File",
        value: "encryptedfile",
      },
    ],
    required: true,
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ModalFree v-model="commandModalOpen" title="Create Field">
    <FormGenerator
      :fields="createFields"
      :request="commandRequest"
      :data="{ template_id: templateId, action: 'data_sheets/create_field' }"
    />
  </ModalFree>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Field
  </ButtonNormal>
</template>
