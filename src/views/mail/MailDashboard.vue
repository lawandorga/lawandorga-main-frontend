<template>
  <BoxLoader :show="userStore.loaded && !!actionsMailUser">
    <div v-if="userStore.loaded && !!actionsMailUser" class="max-w-3xl mx-auto">
      <BreadcrumbsBar
        :base="{ name: 'mail-dashboard' }"
        :pages="[]"
        class="mb-6"
      >
        <EnvelopeIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <template v-if="page != null">
        <template v-if="page.noMailAccount">
          <div class="px-6 py-5 mt-10 bg-white rounded shadow">
            <h1 class="text-lg font-bold text-gray-800">Mail User Role</h1>
            <div class="mt-5">
              <div class="prose">
                <p>
                  You don't have a mail role, yet. Click the button to create
                  one:
                </p>
                <ButtonNormal
                  kind="action"
                  @click="actionsMailUser.createMailUserRole()"
                >
                  Create my mail user role
                </ButtonNormal>
                <p>
                  As soon as you have a mail role you can assign yourself an
                  address and setup your local mail client.
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <TabControls
            :tabs="[
              { name: 'Mail User Role', key: 'mailUserRole' },
              { name: 'Domain', key: 'domain' },
            ]"
          >
            <template #mailUserRole><MailUserRole /></template>
            <template #domain><MailDomain /></template>
          </TabControls>
        </template>
      </template>
    </div>
  </BoxLoader>
  <ActionsMailUser
    v-if="page !== undefined"
    ref="actionsMailUser"
    :page="page"
    :query-page="queryPage"
  />
  <ActionsDomain
    v-if="page !== undefined"
    ref="actionsDomain"
    :page="page"
    :query-page="queryPage"
  />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { provide, ref } from "vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";
import { ButtonNormal } from "@lawandorga/components";
import TabControls from "@/components/TabControls.vue";
import { actionsDomainKey, actionsMailUserKey } from "@/types/keys";
import MailUserRole from "@/components/MailUserRole.vue";
import MailDomain from "@/components/MailDomain.vue";
import ActionsDomain from "@/components/ActionsDomain.vue";
import { MailDashboardPage, NoMailAccount } from "@/types/mail";
import useQuery from "@/composables/useQuery";
import { mailGetDashboardPage } from "@/services/mail";
import useGet from "@/composables/useGet";

// user store
const userStore = useUserStore();

// load the page
const page = ref<MailDashboardPage | NoMailAccount>();
useGet(mailGetDashboardPage, page);

// query function
const queryPage = useQuery(mailGetDashboardPage, page);

// mail user actions
const actionsMailUser = ref<typeof ActionsMailUser>();
provide(actionsMailUserKey, actionsMailUser);

// domain actions
const actionsDomain = ref<typeof ActionsDomain>();
provide(actionsDomainKey, actionsDomain);
</script>
