<script setup lang="ts">
import { TableGenerator } from "lorga-ui";

import GrantGroupAccessToFolder from "../actions/GrantGroupAccessToFolder.vue";
import RevokeAccessFromGroup from "../actions/RevokeAccessFromGroup.vue";
import { FolderItem } from "../api/useFolderPage";

defineProps<{
  query: () => void;
  item: FolderItem;
}>();
</script>

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
      <GrantGroupAccessToFolder
        :folder-uuid="item.folder.uuid"
        :query="query"
      />
    </template>
    <template #action="access">
      <RevokeAccessFromGroup
        v-if="access.actions.includes('REVOKE_ACCESS')"
        :query="query"
        :groups="item.group_access"
        :group-uuid="access.uuid"
        :folder-uuid="item.folder.uuid"
      />
    </template>
  </TableGenerator>
</template>
