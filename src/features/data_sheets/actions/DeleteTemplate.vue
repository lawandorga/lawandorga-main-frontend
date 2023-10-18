<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete Template
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Template"
      :request="commandRequest"
      :data="{
        template_id: templateId,
        action: 'data_sheets/delete_template',
      }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId: number;
  templateName: string;
}>();
const { query, templateId } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
