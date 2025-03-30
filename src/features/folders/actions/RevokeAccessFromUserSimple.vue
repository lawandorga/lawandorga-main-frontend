<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke Access
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    :data="{
      folder_uuid: folderUuid,
      of_uuid: userUuid,
      action: 'folders/revoke_access_from_user',
    }"
    :request="commandRequest"
    title="Revoke access"
    submit="Revoke access"
  >
    Are you sure you want to revoke this access?
  </ModalConfirm>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  folderUuid: string;
  userUuid: string;
  query: () => void;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
