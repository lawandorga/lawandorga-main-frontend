<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Upload Multiple Files
    <ModalCreate
      v-model="commandModalOpen"
      title="Upload Multiple Files"
      :fields="fieldsMultiple"
      :request="commandRequest"
      :initial="{ folder: folderUuid }"
      submit="Upload"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { toRefs, ref, Ref } from "vue";
import useCommand from "@/composables/useCommand";
import axios, { AxiosProgressEvent } from "axios";

// request
function request(
  data: {
    files: File[];
    folder: string;
  },
  percentage: Ref<number>,
): Promise<void> {
  const formData = new FormData();

  if (data.files)
    data.files.forEach((i: File) => {
      formData.append("files", i);
    });
  if (data.folder) formData.append("folder", data.folder);

  percentage.value = 0;

  const config = {
    onUploadProgress: function (progressEvent: AxiosProgressEvent) {
      if (progressEvent.total)
        percentage.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
    },
  };

  return axios.post("files/v2/multiple/", formData, config).then(() => {
    setTimeout(() => {
      percentage.value = 0;
    }, 500);
  });
}

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// create
const percentage = ref<number>(0);
const fieldsMultiple = [
  {
    label: "Files",
    type: "files",
    name: "files",
    required: true,
    percentage: percentage,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCommand(
  request,
  percentage,
  query.value,
);

// expose
defineExpose({
  commandModalOpen,
});
</script>
