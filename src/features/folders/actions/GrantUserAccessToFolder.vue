<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";

const props = defineProps<{
  folderUuid: string;
  query: () => void;
}>();

const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { formProfilesUuid } = useProfiles({ doQuery: commandModalOpen });

const grantAccessFields = computed<types.FormField[]>(() => {
  return [
    {
      label: "Person",
      name: "to_uuid",
      type: "select",
      required: true,
      options: formProfilesUuid.value,
    },
  ];
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Grant access
    <ModalUpdate
      v-model="commandModalOpen"
      title="Grant Access"
      :fields="grantAccessFields"
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        action: 'folders/grant_access_to_user',
      }"
      submit="Grant Access"
    />
  </ButtonNormal>
</template>
