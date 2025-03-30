<template>
  <BoxHeadingStats
    title="Access"
    :show="selectedType === 'FOLDER' && selectedId === 'ACCESS'"
    :stats="['The following persons and groups have access to this folder']"
    nopadding
  >
    <TableGenerator
      :head="[
        { name: 'Person', key: 'name' },
        { name: '', key: 'action' },
      ]"
      :data="access"
    >
      <template #action="{ i }">
        <FoldersRevokeAccessUserSimple
          v-if="i.actions.includes('REVOKE_ACCESS')"
          :folder-uuid="folderUuid"
          :user-uuid="i.uuid"
          :query="query"
        />
      </template>
    </TableGenerator>
    <TableGenerator
      class="mt-8"
      :head="[
        { name: 'Group', key: 'name' },
        { name: '', key: 'action' },
      ]"
      :data="groupAccess"
    >
      <template #action="{ i }">
        <FoldersRevokeAccessGroupSimple
          v-if="i.actions.includes('REVOKE_ACCESS')"
          :folder-uuid="folderUuid"
          :group-uuid="i.uuid"
          :query="query"
        />
      </template>
    </TableGenerator>
  </BoxHeadingStats>
</template>

<script lang="ts" setup>
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { TableGenerator } from "lorga-ui";
import FoldersRevokeAccessUserSimple from "@/features/folders/actions/RevokeAccessFromUserSimple.vue";
import FoldersRevokeAccessGroupSimple from "../actions/RevokeAccessFromGroupSimple.vue";
import { Access } from "../api/useFolderPage";

defineProps<{
  selectedType: string;
  access: Access[];
  groupAccess: Access[];
  selectedId: string | null | number;
  folderUuid: string;
  query: () => void;
}>();
</script>
