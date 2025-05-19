<script lang="ts" setup>
import { TableGenerator } from "lorga-ui";
import { useRecordsPermissions } from "../api/useRecordsPermissions";

const { permissions } = useRecordsPermissions();
</script>

<template>
  <TableGenerator
    :head="[
      { name: 'User', key: (obj) => obj.user_name },
      { name: 'Group', key: (obj) => obj.group_name },
      { name: 'Permission', key: (obj) => obj.permission_name },
    ]"
    :data="permissions"
  />
</template>
