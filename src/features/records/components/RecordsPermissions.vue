<template>
  <TableGenerator
    :head="[
      { name: 'User', key: (obj) => obj.user_object?.name },
      { name: 'Group', key: (obj) => obj.group_object?.name },
      { name: 'Permission', key: (obj) => obj.permission_object.name },
    ]"
    :data="permissions"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TableGenerator } from "@lawandorga/components";
import RecordsService from "@/services/records";
import { HasPermission } from "@/types/core";
import useGet from "@/composables/useGet";

const permissions = ref<HasPermission[] | null>(null);

useGet(RecordsService.getGeneralPermissions, permissions);
</script>
