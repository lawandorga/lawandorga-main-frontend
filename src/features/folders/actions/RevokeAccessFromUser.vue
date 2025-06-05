<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { Access } from "../api/useFolderPage";

const props = defineProps<{
  query: () => void;
  persons: Access[];
  userUuid: string;
  folderUuid: string;
}>();
const { query, persons } = toRefs(props);

const revokeAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "of_uuid",
      type: "select",
      required: true,
      options: persons.value,
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Revoke Access"
      :fields="revokeAccessFields"
      :request="commandRequest"
      :data="{
        action: 'folders/revoke_access_from_user',
        folder_uuid: folderUuid,
        of_uuid: userUuid,
      }"
      submit="Revoke Access"
    />
  </ButtonNormal>
</template>
