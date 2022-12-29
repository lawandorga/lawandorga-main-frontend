<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Record
    <ModalForm
      v-model="commandModalOpen"
      title="Create Record"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :initial="{ folder: folderUuid }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { RecordTemplate } from "@/types/records";
import { ButtonNormal, ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import RecordsService, { recordsCreateRecord } from "@/services/records";
import useGet from "@/composables/useGet";

// props
const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query } = toRefs(props);

// create within folder
const { commandRequest, commandModalOpen } = useCommand(
  recordsCreateRecord,
  query.value,
);

// create within records folder
const availableTemplates = ref<RecordTemplate[]>([]);
watch(commandModalOpen, () => {
  useGet(RecordsService.getTemplates, availableTemplates);
});

// fields
const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Template",
    type: "select",
    name: "template",
    required: true,
    options: availableTemplates.value,
  },
]);

// expose
defineExpose({
  commandModalOpen,
});
</script>
