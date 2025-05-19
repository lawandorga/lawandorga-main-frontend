<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  folderUuid: string;
  folderName: string;
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Folder"
      :request="commandRequest"
      :object-name="folderName"
      :data="{
        folder_uuid: folderUuid,
        action: 'folders/delete_folder',
      }"
    >
      Are you sure you want to delete '{{ folderName }}'? This will delete all
      subfolders and the content.
    </ModalDelete>
  </ButtonNormal>
</template>
