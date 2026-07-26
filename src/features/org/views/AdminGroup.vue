<script lang="ts" setup>
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator, TableSortable, ButtonNormal } from "lorga-ui";
import { useRoute } from "vue-router";

import ActivityBadge from "@/components/ActivityBadge.vue";
import ActivityFilter from "@/components/ActivityFilter.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import {
  getActivitySortValue,
  useActivityFilter,
} from "@/composables/useActivityFilter";
import GroupsAddMember from "@/features/org/actions/AddMemberToGroup.vue";
import GroupsRemoveMember from "@/features/org/actions/RemoveMemberFromGroup.vue";
import GroupAddPermission from "@/features/permissions/actions/AddPermissionToGroup.vue";
import RemovePermission from "@/features/permissions/actions/RemovePermission.vue";

import { useGroup } from "../api/useGroup";

const route = useRoute();

const { members, permissions, query, group } = useGroup(
  route.params.id as string,
);

const {
  activityFilter,
  toggleFilter,
  filteredItems: filteredMembers,
} = useActivityFilter(members);
</script>

<template>
  <BoxLoader :show="!!group">
    <div v-if="!!group" class="mx-auto max-w-(--breakpoint-lg) space-y-6">
      <BreadcrumbsBar
        v-if="group"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Groups',
            to: { name: 'admin-groups' },
          },
          {
            name: group.name,
            to: { name: 'admin-group', params: { id: String(group.id) } },
          },
        ]"
      >
        <CogIcon class="h-6 w-6" />
      </BreadcrumbsBar>
      <div class="rounded bg-white px-5 py-4 shadow">
        <h2 class="mb-4 text-lg font-bold">
          {{ group.name }}
        </h2>
        <div>
          <p>{{ group.description }}</p>
        </div>
      </div>

      <TableGenerator
        :head="[
          { name: 'Permission', key: 'permission_name' },
          { name: '', key: 'action' },
        ]"
        :data="permissions"
      >
        <template #head-action>
          <GroupAddPermission :query="query" :group-id="group.id" />
        </template>
        <template #action="slotProps">
          <RemovePermission
            :query="query"
            :permission-name="slotProps.permission_name"
            :permission-id="slotProps.id"
          />
        </template>
      </TableGenerator>

      <div class="space-y-4">
        <ActivityFilter :model-value="activityFilter" @toggle="toggleFilter" />

        <TableSortable
          sort-key="activity_state"
          sort-order="ASC"
          :get-value-func="getActivitySortValue"
          :head="[
            { name: 'Name', key: 'name', sortable: true },
            { name: 'E-Mail', key: 'email' },
            { name: 'Last Login', key: 'last_login_month', sortable: true },
            { name: 'Activity', key: 'activity_state', sortable: true },
            { name: '', key: 'action' },
          ]"
          :data="filteredMembers"
        >
          <template #name="{ item }">
            <ButtonNormal
              kind="link"
              :to="{ name: 'admin-profile', params: { id: item.id } }"
            >
              {{ item.name }}
            </ButtonNormal>
          </template>
          <template #activity_state="{ item }">
            <ActivityBadge :state="item.activity_state" />
          </template>
          <template #head-action>
            <GroupsAddMember :group-id="group.id" :query="query" />
          </template>
          <template #action="{ item }">
            <GroupsRemoveMember
              :member-id="item.id"
              :group-id="group.id"
              :query="query"
              :member-name="item.name"
            />
          </template>
        </TableSortable>
        <p
          v-if="filteredMembers && filteredMembers.length === 0"
          role="status"
          class="py-6 text-center text-sm text-gray-500"
        >
          No members match the selected activity filter.
        </p>
      </div>
    </div>
  </BoxLoader>
</template>
