<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { useGroups } from "@/features/org/api/useGroups";

const props = defineProps<{
  folderUuid: string;
  query: () => void;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { formGroups } = useGroups({ doQuery: commandModalOpen });

const grantAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Group",
      name: "group_uuid",
      type: "select",
      required: true,
      options: formGroups.value,
    },
  ];
});
</script>

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
