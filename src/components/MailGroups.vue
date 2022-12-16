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
        <div class="flex justify-end">
          <ButtonNormal
            kind="action"
            @click="actionsMailGroups.createModalOpen = true"
          >
            Create Group
          </ButtonNormal>
        </div>
      </template>
      <template #group="item">
        <ButtonLink :to="{ name: 'mail-group', params: { uuid: item.uuid } }">
          {{ item.email }}
        </ButtonLink>
      </template>
      <template #action="item">
        <div class="flex justify-end space-x-3">
          <ButtonNormal
            size="xs"
            kind="delete"
            @click="
              actionsMailGroups.temporary = item;
              actionsMailGroups.deleteModalOpen = true;
            "
          >
            Delete
          </ButtonNormal>
        </div>
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
import {
  IMailDomain,
  IMailGroup,
  MailDashboardPage,
  NoMailAccount,
} from "@/types/mail";
import { ButtonNormal, TableGenerator } from "@lawandorga/components";
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
const availableDomains = computed<IMailDomain[]>(() => {
  return page.value.noMailAccount ? [] : page.value.available_domains;
});
</script>
