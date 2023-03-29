<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update Template
    <ModalUpdate
      v-model="commandModalOpen"
      :fields="updateFields"
      :data="{ id: templateId, name: templateName, show: templateShow }"
      :request="commandRequest"
      title="Update Template"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId?: number;
  templateName: string;
  templateShow: string[];
}>();
const { query, templateId } = toRefs(props);

const updateFields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Fields in Table",
    name: "show",
    type: "list",
    required: true,
    helptext:
      "This field is not used anymore and it will have no effect. You can now define custom personal views or shared views directly under records.",
  },
];

const client = useClient();

const update = client.put("api/records/templates/{}/", templateId);

const { commandRequest, commandModalOpen } = useCommand(update, query.value);
</script>
