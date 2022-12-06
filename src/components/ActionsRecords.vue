<template>
  <ModalForm
    v-model="createModalOpen"
    title="Create Record"
    :fields="createFields"
    :request="createRequest"
    submit="Create"
    @success="recordCreated($event)"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { RecordTemplate, Record } from "@/types/records";
import { ModalForm, types } from "@lawandorga/components";
import { computed, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import RecordsService from "@/services/records";
import useGet from "@/composables/useGet";
import { IAvailableFolder } from "@/types/folders";
import { foldersGetAvailableFolders } from "@/services/folders";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

//
const router = useRouter();

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(RecordsService.createRecord, query);

const recordCreated = (record: Record) => {
  router.push({ name: "records-detail", params: { id: record.id } });
};

const availableFolders = ref<IAvailableFolder[]>([]);
const availableTemplates = ref<RecordTemplate[]>([]);

watch(createModalOpen, () => {
  useGet(RecordsService.getTemplates, availableTemplates);
  useGet(foldersGetAvailableFolders, availableFolders);
});

const createFields = computed<types.FormField[]>(() => [
  {
    label: "Folder",
    type: "hidden",
    name: "folder",
    required: true,
    options: availableFolders.value,
  },
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

defineExpose({
  createModalOpen,
});
</script>
