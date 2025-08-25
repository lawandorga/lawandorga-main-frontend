<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useOrg } from "../api/useOrg";
import UpdateOrg from "../actions/UpdateOrg.vue";

const { query, org } = useOrg();
</script>

<template>
  <BoxLoader :show="!!org">
    <div class="max-w-(--breakpoint-lg) mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Org', to: { name: 'admin-org' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div class="grid grid-cols-2 gap-y-6">
        <div
          v-if="org"
          class="max-w-lg px-6 py-5 bg-white rounded-lg shadow-md"
        >
          <div class="flex items-center justify-between pb-4 border-b">
            <h2 class="text-2xl font-semibold text-gray-800">{{ org.name }}</h2>
            <div class="flex items-center space-x-4">
              <UpdateOrg
                :query="query"
                :org-id="org.id"
                :org-name="org.name"
                :default-group-for-new-users="
                  org.default_group_for_new_users?.id || null
                "
                :org-is-events-enabled="org.is_events_enabled"
                :org-is-mail-enabled="org.is_mail_enabled"
                :org-is-chat-enabled="org.is_chat_enabled"
                :org-user-qualifications="org.user_qualifications"
              />
            </div>
          </div>
          <div class="mt-6 space-y-4 text-sm text-gray-600">
            <div class="flex items-center">
              <span class="font-medium text-gray-800">Name:</span>
              <span class="ml-2">{{ org.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800">
                Default group for new users:
              </span>
              <span class="ml-2">
                {{ org.default_group_for_new_users?.name || "---" }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800">Events enabled:</span>
              <span class="ml-2">
                {{ org.is_events_enabled ? "Yes" : "No" }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800">Mail enabled:</span>
              <span class="ml-2">{{ org.is_mail_enabled ? "Yes" : "No" }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800">Chat enabled:</span>
              <span class="ml-2">{{ org.is_chat_enabled ? "Yes" : "No" }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium text-gray-800">
                User Qualifications:
              </span>
              <span class="ml-2">{{ org.user_qualifications.join(", ") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>
