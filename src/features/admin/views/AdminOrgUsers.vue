<script lang="ts" setup>
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableSortable } from "lorga-ui";

import ActivityBadge from "@/components/ActivityBadge.vue";
import ActivityFilter from "@/components/ActivityFilter.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import {
  getActivitySortValue,
  useActivityFilter,
} from "@/composables/useActivityFilter";
import UsersAcceptUser from "@/features/admin/actions/AcceptOrgUser.vue";
import UsersActivateDeactivateUser from "@/features/admin/actions/ActivateDeactivateUser.vue";
import UsersDeleteUser from "@/features/admin/actions/DeleteUser.vue";
import UsersUnlockUser from "@/features/admin/actions/UnlockUser.vue";

import { useProfiles } from "../api/useProfiles";

const { profiles, query } = useProfiles();

const {
  activityFilter,
  toggleFilter,
  filteredItems: filteredProfiles,
} = useActivityFilter(profiles);
</script>

<template>
  <BoxLoader show>
    <div class="mx-auto max-w-(--breakpoint-xl) space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Profiles', to: { name: 'admin-profiles' } }]"
      >
        <CogIcon class="h-6 w-6" />
      </BreadcrumbsBar>

      <ActivityFilter :model-value="activityFilter" @toggle="toggleFilter" />

      <TableSortable
        v-if="filteredProfiles?.length !== 0"
        sort-key="activity_state"
        sort-order="ASC"
        :get-value-func="getActivitySortValue"
        :head="[
          { name: 'Name', key: 'name', sortable: true },
          { name: 'E-Mail', key: 'email' },
          { name: 'Phone', key: 'phone_number' },
          { name: 'Groups', key: 'group_names' },
          { name: 'Last Login', key: 'last_login_month', sortable: true },
          { name: 'Activity', key: 'activity_state', sortable: true },
          { name: '', key: 'action' },
        ]"
        :data="filteredProfiles"
      >
        <template #group_names="{ item }">
          {{ item.group_names.join(", ") }}
        </template>
        <template #name="{ item }">
          <div class="flex items-center space-x-1">
            <ButtonLink
              :to="{
                name: 'admin-profile',
                params: { id: item.id },
              }"
            >
              <span class="whitespace-nowrap">
                {{ item.name }}
              </span>
            </ButtonLink>
            <template
              v-for="qualification in item.qualifications"
              :key="qualification"
            >
              <span
                class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
              >
                {{ qualification }}
              </span>
            </template>
          </div>
        </template>
        <template #activity_state="{ item }">
          <ActivityBadge :state="item.activity_state" />
        </template>
        <template #action="{ item }">
          <UsersAcceptUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-accepted="item.accepted"
          />
          <UsersUnlockUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-locked="item.locked"
          />
          <UsersActivateDeactivateUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-active="item.is_active"
          />
          <UsersDeleteUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
          />
        </template>
      </TableSortable>
      <div v-else class="py-10 text-center text-sm text-gray-500">
        No users match the selected activity filter.
      </div>
    </div>
  </BoxLoader>
</template>
