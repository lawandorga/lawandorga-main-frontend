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

<script lang="ts" setup>
import { ref } from "vue";
import { TableGenerator } from "@lawandorga/components";
import { HasPermission } from "@/types/core";
import useClient from "@/api/client";
import useGet from "@/composables/useGet";

const permissions = ref<HasPermission[] | null>(null);

const request = useClient().get(
  "api/permissions/query/has_permissions/record/",
);
useGet(request, permissions);
</script>
