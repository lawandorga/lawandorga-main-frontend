<template>
  <BoxLoader :show="userStore.loaded && !!actionsMailUsers">
    <div
      v-if="userStore.loaded && !!actionsMailUsers"
      class="max-w-3xl mx-auto"
    >
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
              @click="actionsMailUsers.addAddressModalOpen = true"
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
                actionsMailUsers.temporary = item;
                actionsMailUsers.setDefaultAddressModalOpen = true;
              "
            >
              Set as default
            </ButtonNormal>
            <ButtonNormal
              kind="delete"
              @click="
                actionsMailUsers.temporary = item;
                actionsMailUsers.deleteAddressModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
  <ActionsMailUsers
    ref="actionsMailUsers"
    :available-domains="availableDomains"
    :query="query"
    :user-id="($route.params.uuid as string)"
  />
</template>

<script lang="ts" setup>
import ActionsMailUsers from "@/components/ActionsMailUsers.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet from "@/composables/useGet";
import { mailGetUserPage } from "@/services/mail";
import { useUserStore } from "@/store/user";
import { IMailAddress, IMailDomain, IMailUserPage } from "@/types/mail";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

// store
const userStore = useUserStore();

// actions
const actionsMailUsers = ref<typeof ActionsMailUsers>();

// page
const route = useRoute();
const page = ref<IMailUserPage>();
const query = useGet(mailGetUserPage, page, route.params.uuid as string);

// available domains
const availableDomains = computed<IMailDomain[]>(() => {
  if (!page.value) return [];
  return page.value.available_domains;
});

// addresses
const addresses = computed<IMailAddress[] | null>(() => {
  if (!page.value) return null;
  return page.value.addresses;
});
</script>
