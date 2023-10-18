<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update Template
    <ModalUpdate
      v-model="commandModalOpen"
      :fields="updateFields"
      :data="{
        template_id: templateId,
        template_name: templateName,
        action: 'data_sheets/update_template',
      }"
      :request="commandRequest"
      title="Update Template"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId?: number;
  templateName: string;
}>();
const { query, templateId } = toRefs(props);

const updateFields: types.FormField[] = [
  {
    label: "Name",
    name: "template_name",
    type: "text",
    required: true,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
