<script lang="ts" setup>
import MailAddAddress from "@/features/mail/actions/AddAddressToUser.vue";
import MailDeleteAddress from "@/features/mail/actions/DeleteUserAddress.vue";
import MailSetDefaultAddress from "@/features/mail/actions/SetDefaultUserAddress.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import { useRoute } from "vue-router";
import { type MailAddress, useGetUserPage } from "../api/useGetUserPage";

const userStore = useUserStore();

const route = useRoute();
const uuid = route.params.uuid as string;

const { page, query, addresses } = useGetUserPage(uuid);
</script>

<template>
  <BoxLoader :show="userStore.loaded && !!page">
    <div v-if="userStore.loaded && !!page" class="max-w-3xl mx-auto">
      <BreadcrumbsBar
        :base="{ name: 'mail-dashboard' }"
        :pages="[
          {
            name: 'User',
            to: { name: 'mail-user', params: { uuid: $route.params.uuid } },
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
          <MailAddAddress
            :query="query"
            :user-uuid="uuid"
            :available-domains="page.available_domains"
          />
        </template>
        <template #action="item">
          <MailSetDefaultAddress
            v-show="!item.is_default"
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="uuid"
          />
          <MailDeleteAddress
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="uuid"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
