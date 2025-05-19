<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// create
const fields = [
  {
    label: "File",
    type: "file",
    name: "file",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCmd(query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Upload File
    <ModalCreate
      v-model="commandModalOpen"
      title="Upload File"
      :fields="fields"
      :request="commandRequest"
      :data="{ folder_uuid: folderUuid, action: 'files/upload_file' }"
      submit="Upload"
    />
  </ButtonNormal>
</template>
