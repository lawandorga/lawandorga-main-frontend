<template>
  <TableGenerator
    :data="item.group_access"
    :head="[
      { name: 'Person with access', key: 'name' },
      { name: 'Source', key: 'source' },
      { name: '', key: 'action' },
    ]"
  >
    <template #head-action>
      <FoldersGrantAccessGroup
        :folder-uuid="item.folder.uuid"
        :query="query"
        :available-groups="availableGroups"
      />
    </template>
    <template #action="access">
      <FoldersRevokeAccessGroup
        v-if="access.actions.includes('REVOKE_ACCESS')"
        :query="query"
        :groups="item.group_access"
        :group-uuid="access.uuid"
        :folder-uuid="item.folder.uuid"
      />
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import { TableGenerator } from "lorga-ui";
import FoldersGrantAccessGroup from "../actions/FoldersGrantAccessGroup.vue";
import FoldersRevokeAccessGroup from "../actions/FoldersRevokeAccessGroup.vue";
import { FolderGroup, FolderItem } from "../api/useFolderPage";

defineProps<{
  query: () => void;
  item: FolderItem;
  availableGroups: FolderGroup[];
}>();
</script>
