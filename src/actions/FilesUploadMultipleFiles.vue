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
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { toRefs, ref, Ref, computed } from "vue";
import useCommand from "@/composables/useCommand";
import axios, { AxiosProgressEvent } from "axios";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// request
function request(
  data: {
    files: File[];
    folder: string;
  },
  percentage: Ref<string>,
): Promise<void> {
  const formData = new FormData();

  if (data.files)
    data.files.forEach((i: File) => {
      formData.append("files", i);
    });
  if (data.folder) formData.append("folder", data.folder);

  percentage.value = "(0%)";

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
        percentage.value = "";
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
const { commandModalOpen, commandRequest } = useCommand(
  request,
  addon,
  query.value,
);

// expose
defineExpose({
  commandModalOpen,
});
</script>
