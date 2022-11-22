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
import { ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import RecordsService from "@/services/records";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

//
const router = useRouter();

const createFields = ref<types.FormField[]>([
  {
    label: "Template",
    type: "select",
    name: "template",
    required: true,
    options: [] as RecordTemplate[],
  },
]);

const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(RecordsService.createRecord, query);

const recordCreated = (record: Record) => {
  router.push({ name: "records-detail", params: { id: record.id } });
};

watch(createModalOpen, () => {
  RecordsService.getTemplates().then(
    (templates) => (createFields.value[0].options = templates),
  );
});

defineExpose({
  createModalOpen,
});
</script>
