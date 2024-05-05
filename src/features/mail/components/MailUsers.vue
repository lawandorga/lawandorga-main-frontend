<template>
  <TableGenerator
    :head="[
      { name: 'User', key: 'name' },
      { name: 'E-Mail', key: 'email' },
    ]"
    :data="users"
  >
    <template #name="item">
      <ButtonLink :to="{ name: 'mail-user', params: { uuid: item.uuid } }">
        {{ item.name }}
      </ButtonLink>
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import { TableGenerator } from "lorga-ui";
import ButtonLink from "@/components/ButtonLink.vue";
import { MailUser } from "../api/useGetDashboardPage";

defineProps<{
  users: MailUser[] | null;
}>();
</script>
