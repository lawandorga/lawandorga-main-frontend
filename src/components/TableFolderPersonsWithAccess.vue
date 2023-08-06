<template>
  <TableGenerator
    :data="item.access"
    :head="[
      { name: 'Person with access', key: 'name' },
      { name: 'Source', key: 'source' },
      { name: '', key: 'action' },
    ]"
  >
    <template #head-action>
      <FoldersGrantAccess
        :folder-uuid="item.folder.uuid"
        :query="query"
        :available-persons="availablePersons"
      />
    </template>
    <template #action="access">
      <FoldersRevokeAccessUser
        v-if="access.actions.REVOKE_ACCESS"
        :query="query"
        :persons="item.access"
        :user-uuid="(access.actions.REVOKE_ACCESS.user_uuid as string)"
        :folder-uuid="item.folder.uuid"
        :url="(access.actions.REVOKE_ACCESS.url as string)"
      />
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import FoldersGrantAccess from "@/actions/FoldersGrantAccess.vue";
import FoldersRevokeAccessUser from "@/actions/FoldersRevokeAccessUser.vue";
import { IAccess, IFolderItem } from "@/types/folders";
import { TableGenerator } from "lorga-ui";

defineProps<{
  query: () => void;
  item: IFolderItem;
  availablePersons?: IAccess[];
}>();
</script>
