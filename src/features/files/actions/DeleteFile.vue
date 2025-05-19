<script lang="ts" setup>
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

// emits
const emit = defineEmits(["deleted"]);

// props
const props = defineProps<{
  fileUuid: string;
  fileName: string;
  query: () => void;
}>();
const { fileUuid, query } = toRefs(props);

// delete
const { commandModalOpen, commandRequest } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete File
    <ModalDelete
      v-model="commandModalOpen"
      :data="{ file_uuid: fileUuid, action: 'files/delete_file' }"
      :request="commandRequest"
      title="Delete File"
      :obj-name="fileName"
      @deleted="emit('deleted')"
    />
  </ButtonNormal>
</template>
