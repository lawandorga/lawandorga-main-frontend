<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="max-w-3xl mx-auto space-y-8">
      <BreadcrumbsBar
        :base="{ name: 'mail-dashboard' }"
        :pages="[
          {
            name: 'Group',
            to: { name: 'mail-group', params: { uuid: uuid } },
          },
        ]"
        class="mb-6"
      >
        <EnvelopeIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Address', key: 'localpart' },
          { name: 'Domain', key: (o: MailAddress) => o.domain.name },
          { name: 'default', key: 'is_default' },
          { name: '', key: 'action' },
        ]"
        :data="addresses"
      >
        <template #head-action>
          <MailGroupAddAddress
            :query="query"
            :group-uuid="uuid"
            :available-domains="availableDomains"
          />
        </template>
        <template #action="item">
          <MailSetDefaultGroupAddress
            v-show="!item.is_default"
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :group-uuid="uuid"
          />
          <MailGroupDeleteAddress
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :group-uuid="uuid"
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
            :group-uuid="uuid"
            :available-users="page.available_users"
          />
        </template>
        <template #action="item">
          <MailGroupRemoveMember
            :query="query"
            :group-uuid="uuid"
            :member-name="item.name"
            :member-uuid="item.uuid"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import MailGroupAddAddress from "@/features/mail/actions/MailGroupAddAddress.vue";
import MailGroupAddMember from "@/features/mail/actions/MailGroupAddMember.vue";
import MailGroupDeleteAddress from "@/features/mail/actions/MailGroupDeleteAddress.vue";
import MailGroupRemoveMember from "@/features/mail/actions/MailGroupRemoveMember.vue";
import MailSetDefaultGroupAddress from "@/features/mail/actions/MailSetDefaultGroupAddress.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import { useRoute } from "vue-router";
import { MailAddress, useGetGroupPage } from "../api/useGetGroupPage";

const userStore = useUserStore();

const route = useRoute();
const uuid = route.params.uuid as string;
const { page, query, availableDomains, members, addresses } =
  useGetGroupPage(uuid);
</script>
