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
          { name: 'Domain', key: (o: IMailAddress) => o.domain.name },
          { name: 'default', key: 'is_default' },
          { name: '', key: 'action' },
        ]"
        :data="addresses"
      >
        <template #head-action>
          <MailAddAddress
            :query="query"
            :user-uuid="$route.params.uuid as string"
            :available-domains="page.available_domains"
          />
        </template>
        <template #action="item">
          <MailSetDefaultAddress
            v-show="!item.is_default"
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="$route.params.uuid as string"
          />
          <MailDeleteAddress
            :email="`${item.localpart}@${item.domain.name}`"
            :query="query"
            :address-uuid="item.uuid"
            :user-uuid="$route.params.uuid as string"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import MailAddAddress from "@/features/mail/actions/MailAddAddress.vue";
import MailDeleteAddress from "@/features/mail/actions/MailDeleteAddress.vue";
import MailSetDefaultAddress from "@/features/mail/actions/MailSetDefaultAddress.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet from "@/composables/useGet";
import { mailGetUserPage } from "@/features/mail/mail";
import { useUserStore } from "@/store/user";
import { IMailAddress, IMailUserPage } from "@/types/mail";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

// store
const userStore = useUserStore();

// page
const route = useRoute();
const page = ref<IMailUserPage>();
const query = useGet(mailGetUserPage, page, route.params.uuid as string);

// addresses
const addresses = computed<IMailAddress[] | null>(() => {
  if (!page.value) return null;
  return page.value.addresses;
});
</script>
@/features/mail/mail
