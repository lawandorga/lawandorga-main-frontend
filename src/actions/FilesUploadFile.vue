<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Upload File
    <ModalCreate
      v-model="commandModalOpen"
      title="Upload File"
      :fields="fields"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Upload"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import axios from "axios";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// request
function request(data: {
  // name: string;
  folder: string;
  file: File;
}): Promise<void> {
  const formData = new FormData();
  if (data.folder) formData.append("folder", data.folder);
  if (data.file) formData.append("file", data.file);
  // if (data.name) formData.append("name", data.name);

  return axios.post(`files/v2/`, formData).then();
}

// create
const fields = [
  {
    label: "File",
    type: "file",
    name: "file",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCommand(request, query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>
