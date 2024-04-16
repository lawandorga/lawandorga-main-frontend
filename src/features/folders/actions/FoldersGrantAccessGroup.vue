<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Grant Access To Group"
      :fields="grantAccessFields"
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        action: 'folders/grant_access_to_group',
      }"
      submit="Grant Access"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { FolderGroup } from "@/types/folders";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  folderUuid: string;
  query: () => void;
  availableGroups: FolderGroup[];
}>();

const { query, availableGroups } = toRefs(props);

const grantAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Group",
      name: "group_uuid",
      type: "select",
      required: true,
      options: availableGroups?.value ? availableGroups.value : [],
    },
  ] as types.FormField[];
});

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
