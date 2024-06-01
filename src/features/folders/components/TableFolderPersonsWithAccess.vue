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
        v-if="access.actions.includes('REVOKE_ACCESS')"
        :query="query"
        :persons="item.access"
        :user-uuid="access.uuid"
        :folder-uuid="item.folder.uuid"
      />
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import FoldersGrantAccess from "@/features/folders/actions/FoldersGrantAccess.vue";
import FoldersRevokeAccessUser from "@/features/folders/actions/FoldersRevokeAccessUser.vue";
import { TableGenerator } from "lorga-ui";
import { FolderItem, FolderPerson } from "../api/useFolderPage";

defineProps<{
  query: () => void;
  item: FolderItem;
  availablePersons: FolderPerson[];
}>();
</script>
