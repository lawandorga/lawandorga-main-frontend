<template>
  <template v-if="actionsMailGroups">
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
          {{ item.email }}
        </ButtonLink>
      </template>
      <template #action="item">
        <MailDeleteGroup
          :query="query"
          :group-name="item.email"
          :group-uuid="item.uuid"
        />
      </template>
    </TableGenerator>
  </template>
  <ActionsMailGroups
    ref="actionsMailGroups"
    :available-domains="availableDomains"
    :query="query"
  />
</template>

<script setup lang="ts">
import MailCreateGroup from "@/actions/MailCreateGroup.vue";
import MailDeleteGroup from "@/actions/MailDeleteGroup.vue";
import {
  IAvailableMailDomain,
  IMailGroup,
  MailDashboardPage,
  NoMailAccount,
} from "@/types/mail";
import { TableGenerator } from "@lawandorga/components";
import { computed, PropType, ref, toRefs } from "vue";
import ActionsMailGroups from "./ActionsMailGroups.vue";
import ButtonLink from "./ButtonLink.vue";

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

// actions
const actionsMailGroups = ref<typeof ActionsMailGroups>();

// groups
const groups = computed<IMailGroup[] | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.groups;
  return null;
});

// available domains
const availableDomains = computed<IAvailableMailDomain[]>(() => {
  return page.value.noMailAccount ? [] : page.value.available_domains;
});
</script>
