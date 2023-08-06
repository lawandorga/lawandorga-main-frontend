<template>
  <BoxHeadingStats
    title="Access"
    :show="selectedType === 'FOLDER' && selectedId === 'ACCESS'"
    :stats="['The following persons have access to this folder']"
    nopadding
  >
    <TableGenerator
      :head="[
        { name: 'Person', key: 'name' },
        { name: '', key: 'action' },
      ]"
      :data="access"
    >
      <template #action="slotProps">
        <FoldersRevokeAccess
          v-if="slotProps.actions.REVOKE_ACCESS"
          :folder-uuid="folderUuid"
          :user-uuid="slotProps.actions.REVOKE_ACCESS.user_uuid"
          :url="slotProps.actions.REVOKE_ACCESS.url"
          :query="query"
        />
      </template>
    </TableGenerator>
  </BoxHeadingStats>
</template>

<script lang="ts" setup>
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { TableGenerator } from "lorga-ui";
import { IAccess } from "@/types/folders";
import FoldersRevokeAccess from "@/actions/FoldersRevokeAccess.vue";

defineProps<{
  selectedType: string;
  access: IAccess[] | null;
  selectedId: string | null | number;
  folderUuid: string;
  query: () => void;
}>();
</script>
