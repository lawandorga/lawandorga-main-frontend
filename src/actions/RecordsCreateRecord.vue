<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Record
    <ModalForm
      v-model="commandModalOpen"
      title="Create Record"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      @success="recordCreated($event)"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { RecordTemplate } from "@/types/records";
import { ButtonNormal, ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import RecordsService, {
  recordsCreateRecordAndFolder,
} from "@/services/records";
import useGet from "@/composables/useGet";
import { useRouter } from "vue-router";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

// create within folder
const { commandRequest, commandModalOpen } = useCommand(
  recordsCreateRecordAndFolder,
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

// created
const router = useRouter();
const recordCreated = (data: { folder_uuid: string; id: number }) => {
  router.push({
    name: "folders-detail",
    params: { uuid: data.folder_uuid, record: data.id },
  });
};

// expose
defineExpose({
  commandModalOpen,
});
</script>
