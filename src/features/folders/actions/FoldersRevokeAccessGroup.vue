<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Revoke access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Revoke Access"
      :fields="revokeAccessFields"
      :request="commandRequest"
      :data="{
        action: 'folders/revoke_access_from_group',
        folder_uuid: folderUuid,
        group_uuid: groupUuid,
      }"
      submit="Revoke Access"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { Access } from "@/types/folders";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groups: Access[];
  groupUuid: string;
  folderUuid: string;
}>();
const { query, groups } = toRefs(props);

const revokeAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Group",
      name: "group_uuid",
      type: "select",
      required: true,
      options: groups.value,
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
