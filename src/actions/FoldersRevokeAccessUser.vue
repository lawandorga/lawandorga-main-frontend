<template>
  <ButtonNormal kind="delete" @click="revokeAccessModalOpen = true">
    Revoke access
    <ModalUpdate
      v-model="revokeAccessModalOpen"
      title="Revoke Access"
      :fields="revokeAccessFields"
      :request="revokeAccessRequest"
      :data="{
        url: url,
        uuid: folderUuid,
        user_uuid: userUuid,
      }"
      submit="Revoke Access"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersRevokeAccess } from "@/services/folders";
import { IAccess } from "@/types/folders";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  persons: IAccess[];
  userUuid: string;
  folderUuid: string;
  url: string;
}>();
const { query, persons } = toRefs(props);

// revoke access
const revokeAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "user_uuid",
      type: "select",
      required: true,
      options: persons.value,
    },
  ] as types.FormField[];
});

const {
  commandRequest: revokeAccessRequest,
  commandModalOpen: revokeAccessModalOpen,
} = useCommand(foldersRevokeAccess, query.value);
</script>
