<template>
  <TableGenerator
    :head="[
      { name: 'User', key: 'name' },
      { name: 'E-Mail', key: 'email' },
    ]"
    :data="addresses"
  >
    <template #name="item">
      <ButtonLink :to="{ name: 'mail-user', params: { uuid: item.uuid } }">
        {{ item.name }}
      </ButtonLink>
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import { IMailUser, MailDashboardPage, NoMailAccount } from "@/types/mail";
import { TableGenerator } from "lorga-ui";
import { computed, PropType, toRefs } from "vue";
import ButtonLink from "./ButtonLink.vue";

// page
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
});
const { page } = toRefs(props);

// addresses
const addresses = computed<IMailUser[] | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.users;
  return null;
});
</script>
