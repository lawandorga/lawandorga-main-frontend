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
import RecordsService from "@/services/records";
import { useRouter } from "vue-router";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

// create within folder
const client = useClient();
const request = client.post<
  {
    name: string;
    folder: string;
    template: number;
  },
  { folder_uuid: string; id: string }
>("api/records/records/v2/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

// create within records folder
const availableTemplates = ref<RecordTemplate[]>([]);
const getTemplates = useQuery(RecordsService.getTemplates, availableTemplates);
watch(commandModalOpen, () => {
  getTemplates();
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
