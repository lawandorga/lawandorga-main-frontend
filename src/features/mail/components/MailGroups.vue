<template>
  <TableGenerator
    :head="[
      { name: 'Group', key: 'group' },
      { name: '', key: 'action' },
    ]"
    :data="groups"
  >
    <template #head-action>
      <MailCreateGroup
        v-if="page && !page.noMailAccount"
        :available-domains="page.available_domains"
        :query="query"
      />
    </template>
    <template #group="item">
      <ButtonLink :to="{ name: 'mail-group', params: { uuid: item.uuid } }">
        {{ item.email || "not-set" }}
      </ButtonLink>
    </template>
    <template #action="item">
      <MailDeleteGroup
        :query="query"
        :group-name="item.email || 'not-set'"
        :group-uuid="item.uuid"
      />
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import MailCreateGroup from "@/features/mail/actions/MailCreateGroup.vue";
import MailDeleteGroup from "@/features/mail/actions/MailDeleteGroup.vue";
import { TableGenerator } from "lorga-ui";
import { computed, PropType, toRefs } from "vue";
import ButtonLink from "@/components/ButtonLink.vue";
import {
  MailDashboardPage,
  MailGroup,
  NoMailAccount,
} from "../api/useGetDashboardPage";

// props
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
  query: {
    required: true,
    type: Function as PropType<() => void>,
  },
});
const { page } = toRefs(props);

// groups
const groups = computed<MailGroup[] | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.groups;
  return null;
});
</script>
