<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke Access
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    :data="{
      folder_uuid: folderUuid,
      of_uuid: userUuid,
      action: 'folders/revoke_access_from_user',
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
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  folderUuid: string;
  userUuid: string;
  url: string;
  query: () => void;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
