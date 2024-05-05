<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="max-w-3xl mx-auto">
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
                <MailCreateMailUser :query="query" />
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
              { name: 'Webmail', key: 'webmail' },
              { name: 'Users', key: 'users' },
              { name: 'Groups', key: 'groups' },
              { name: 'Domain', key: 'domain' },
            ]"
          >
            <template #mailUserRole>
              <MailUserRole
                :query="query"
                :page="page"
                :user="user"
                :addresses="addresses"
              />
            </template>
            <template #webmail><MailWebmail /></template>
            <template #users><MailUsers :users="users" /></template>
            <template #groups>
              <MailGroups :page="page" :query="query" />
            </template>
            <template #domain>
              <MailDomain :domain="domain" :query="query" />
            </template>
          </TabControls>
        </template>
      </template>
    </div>
  </BoxLoader>
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import TabControls from "@/components/TabControls.vue";
import MailUserRole from "@/features/mail/components/MailUserRole.vue";
import MailDomain from "@/features/mail/components/MailDomain.vue";
import MailUsers from "@/features/mail/components/MailUsers.vue";
import MailGroups from "@/features/mail/components/MailGroups.vue";
import MailWebmail from "@/features/mail/components/MailWebmail.vue";
import MailCreateMailUser from "@/features/mail/actions/MailCreateMailUser.vue";
import { useGetDashboardPage } from "../api/useGetDashboardPage";

const userStore = useUserStore();
const { page, query, user, addresses, domain, users } = useGetDashboardPage();
</script>
