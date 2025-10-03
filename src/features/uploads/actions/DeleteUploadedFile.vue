<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  fileUuid: string;
  name: string;
  query: () => void;
}>();
const { fileUuid, name, query } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalConfirm
      v-model="commandModalOpen"
      title="Delete File"
      :request="commandRequest"
      :data="{
        file_uuid: fileUuid,
        action: 'upload/delete_file',
      }"
      submit="Delete"
    >
      Are you sure you want to delete the '{{ name }}' file?
    </ModalConfirm>
  </ButtonNormal>
</template>
