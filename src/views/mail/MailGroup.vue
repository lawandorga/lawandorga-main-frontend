<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="max-w-3xl mx-auto space-y-8">
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
          <MailGroupAddAddress
            :query="query"
            :group-uuid="($route.params.uuid as string)"
            :available-domains="availableDomains"
          />
        </template>
        <template #action="item">
          <MailSetDefaultGroupAddress
            v-show="!item.is_default"
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :group-uuid="($route.params.uuid as string)"
          />
          <MailGroupDeleteAddress
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :group-uuid="($route.params.uuid as string)"
            :available-domains="availableDomains"
          />
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
</template>

<script lang="ts" setup>
import MailGroupAddAddress from "@/actions/MailGroupAddAddress.vue";
import MailGroupAddMember from "@/actions/MailGroupAddMember.vue";
import MailGroupDeleteAddress from "@/actions/MailGroupDeleteAddress.vue";
import MailGroupRemoveMember from "@/actions/MailGroupRemoveMember.vue";
import MailSetDefaultGroupAddress from "@/actions/MailSetDefaultGroupAddress.vue";
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
import { TableGenerator } from "lorga-ui";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

// store
const userStore = useUserStore();

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
