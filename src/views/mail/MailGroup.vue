<template>
  <BoxLoader :show="userStore.loaded && !!actionsMailGroups">
    <div
      v-if="userStore.loaded && !!actionsMailGroups"
      class="max-w-3xl mx-auto space-y-8"
    >
      <BreadcrumbsBar
        :base="{ name: 'mail-dashboard' }"
        :pages="[
          {
            name: 'Group',
            to: { name: 'mail-group', params: { uuid: $route.params.uuid } },
          },
        ]"
        class="mb-6"
      >
        <EnvelopeIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Address', key: 'localpart' },
          { name: 'Domain', key: (o) => o.domain.name },
          { name: 'default', key: 'is_default' },
          { name: '', key: 'action' },
        ]"
        :data="addresses"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              kind="action"
              @click="actionsMailGroups.addAddressModalOpen = true"
            >
              Add Address
            </ButtonNormal>
          </div>
        </template>
        <template #action="item">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              kind="action"
              @click="
                actionsMailGroups.temporary = item;
                actionsMailGroups.setDefaultAddressModalOpen = true;
              "
            >
              Set as default
            </ButtonNormal>
            <ButtonNormal
              kind="delete"
              @click="
                actionsMailGroups.temporary = item;
                actionsMailGroups.deleteAddressModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
      <TableGenerator
        :head="[
          { name: 'Member', key: 'name' },
          { name: 'E-Mail', key: 'email' },
          { name: '', key: 'action' },
        ]"
        :data="members"
      >
        <template #head-action>
          <MailGroupAddMember
            v-if="page"
            :query="query"
            :group-uuid="($route.params.uuid as string)"
            :available-users="page.available_users"
          />
        </template>
        <template #action="item">
          <MailGroupRemoveMember
            :query="query"
            :group-uuid="($route.params.uuid as string)"
            :member-name="item.name"
            :member-uuid="item.uuid"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
  <ActionsMailGroups
    ref="actionsMailGroups"
    :available-domains="availableDomains"
    :query="query"
    :group-id="($route.params.uuid as string)"
  />
</template>

<script lang="ts" setup>
import MailGroupAddMember from "@/actions/MailGroupAddMember.vue";
import MailGroupRemoveMember from "@/actions/MailGroupRemoveMember.vue";
import ActionsMailGroups from "@/components/ActionsMailGroups.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet from "@/composables/useGet";
import { mailGetGroupPage } from "@/services/mail";
import { useUserStore } from "@/store/user";
import {
  IMailAddress,
  IMailDomain,
  IMailGroupPage,
  IMailUser,
} from "@/types/mail";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

// store
const userStore = useUserStore();

// actions
const actionsMailGroups = ref<typeof ActionsMailGroups>();

// page
const route = useRoute();
const page = ref<IMailGroupPage>();
const query = useGet(mailGetGroupPage, page, route.params.uuid as string);

// available domains
const availableDomains = computed<IMailDomain[]>(() => {
  if (!page.value) return [];
  return page.value.available_domains;
});

// members
const members = computed<IMailUser[] | null>(() => {
  if (!page.value) return null;
  return page.value.members;
});

// addresses
const addresses = computed<IMailAddress[] | null>(() => {
  if (!page.value) return null;
  return page.value.addresses;
});
</script>
