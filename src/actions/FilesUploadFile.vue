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
import useClient from "@/api/client";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// request
const client = useClient();
const request = client.postAsFormData("api/files/v2/");

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
