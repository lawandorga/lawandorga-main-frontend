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
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Org', to: { name: 'admin-org' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div class="grid grid-cols-2 gap-y-6">
        <div v-if="org" class="max-w-lg px-6 py-5 bg-white rounded shadow">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">{{ org.name }}</h2>
            <div class="flex items-center space-x-4">
              <UpdateOrg
                :query="query"
                :org-id="org.id"
                :org-name="org.name"
                :default-group-for-new-users="
                  org.default_group_for_new_users?.id || null
                "
              />
            </div>
          </div>
          <div class="mt-4">
            <p>Name: {{ org.name }}</p>
            <p>
              Default group for new users:
              {{ org.default_group_for_new_users?.name || "---" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>
