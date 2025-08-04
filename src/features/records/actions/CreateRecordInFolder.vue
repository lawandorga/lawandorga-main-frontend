<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { computed, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import useClient from "@/api/client";
import { useTemplates } from "@/features/data_sheets/api/useTemplates";
import { useRootFolders } from "@/features/folders/api/useRootFolders";

// props
const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

// create within folder
const client = useClient();
const request = client.postAndReturn<
  {
    token: string;
    template: number;
  },
  { folder_uuid: string; record_uuid: string }
>("api/records/records/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

const { templates: availableTemplates, query: getTemplates } = useTemplates();
const {
  rootFolders,
  query: getRootFolders,
  recordsFolderUuid,
} = useRootFolders();
watch(commandModalOpen, (newValue) => {
  if (newValue) {
    getTemplates();
    getRootFolders();
  }
});

// fields
const fields = computed<types.FormField[]>(() => [
  {
    label: "Token",
    type: "text",
    name: "token",
    required: true,
  },
  {
    label: "Template",
    type: "select",
    name: "template",
    required: false,
    options: availableTemplates.value || [],
  },
  {
    label: "Folder",
    type: "select",
    name: "folder_uuid",
    required: true,
    options: rootFolders.value.map((folder) => ({
      name: folder.name,
      value: folder.uuid,
    })),
  },
]);

// created
const router = useRouter();
const recordCreated = (data: { folder_uuid: string; record_uuid: string }) => {
  router.push({
    name: "folders-detail",
    params: { uuid: data.folder_uuid },
    query: { selectedType: "RECORD", selectedId: data.record_uuid },
  });
};

const data = computed(() => ({
  folder_uuid: recordsFolderUuid.value,
}));

// expose
defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Record
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Record"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="data"
      @success="recordCreated($event)"
    />
  </ButtonNormal>
</template>
