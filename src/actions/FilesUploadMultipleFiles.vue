<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Upload Multiple Files
    <ModalCreate
      v-model="commandModalOpen"
      title="Upload Multiple Files"
      :fields="fieldsMultiple"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Upload"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs, ref, computed } from "vue";
import useCommand from "@/composables/useCommand";
import axios, { AxiosProgressEvent } from "axios";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// request
function request(data: { files: File[]; folder: string }): Promise<void> {
  const formData = new FormData();

  if (data.files)
    data.files.forEach((i: File) => {
      formData.append("files", i);
    });
  if (data.folder) formData.append("folder", data.folder);

  const config = {
    onUploadProgress: function (progressEvent: AxiosProgressEvent) {
      if (progressEvent.total) {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        addon.value = `(${percentage}%)`;
        if (percentage === 100) addon.value = "(Server processing...)";
      }
    },
  };

  return axios
    .post("files/v2/multiple/", formData, config)
    .then(() => {
      /* */
    })
    .finally(() => {
      setTimeout(() => {
        addon.value = "";
      }, 500);
    });
}

// create
const addon = ref<string>("(0%)");
const fieldsMultiple = computed<types.FormField[]>(() => {
  return [
    {
      label: `Files ${addon.value}`,
      type: "files",
      name: "files",
      required: true,
    },
  ];
});
const { commandModalOpen, commandRequest } = useCommand(request, query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>
