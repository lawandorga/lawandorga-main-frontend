<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  folderUuid: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke access
    <ModalConfirm
      v-model="commandModalOpen"
      title="Revoke Access"
      :request="commandRequest"
      :data="{
        action: 'folders/revoke_access_from_group',
        folder_uuid: folderUuid,
        group_uuid: groupUuid,
      }"
      submit="Revoke Access"
    >
      Are you sure you want to revoke this access?
    </ModalConfirm>
  </ButtonNormal>
</template>
