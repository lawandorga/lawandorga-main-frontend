<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke Access
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    :data="{
      id: folderUuid,
      user_uuid: userUuid,
      url: url,
    }"
    :request="commandRequest"
    title="Revoke access"
  >
    Are you sure you want to revoke this access?
  </ModalDelete>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import { foldersRevokeAccess } from "@/services/folders";

// props
const props = defineProps<{
  folderUuid: string;
  userUuid: string;
  url: string;
  query: () => void;
}>();
const { query } = toRefs(props);

// delete
const { commandRequest, commandModalOpen } = useCommand(
  foldersRevokeAccess,
  query.value,
);
</script>
