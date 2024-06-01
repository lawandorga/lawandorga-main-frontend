<template>
  <BoxLoader :show="!!group">
    <div v-if="!!group" class="max-w-screen-lg mx-auto space-y-6">
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
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="px-5 py-4 bg-white rounded shadow">
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

      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'E-Mail', key: 'email' },
          { name: '', key: 'action' },
        ]"
        :data="members"
      >
        <template #name="slotProps">
          <ButtonNormal
            kind="link"
            :to="{ name: 'admin-profile', params: { id: slotProps.id } }"
          >
            {{ slotProps.name }}
          </ButtonNormal>
        </template>
        <template #head-action>
          <GroupsAddMember :group-id="group.id" :query="query" />
        </template>
        <template #action="slotProps">
          <GroupsRemoveMember
            :member-id="slotProps.id"
            :group-id="group.id"
            :query="query"
            :member-name="slotProps.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator, ButtonNormal } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import GroupsAddMember from "@/features/org/actions/GroupsAddMember.vue";
import GroupsRemoveMember from "@/features/org/actions/GroupsRemoveMember.vue";
import GroupAddPermission from "@/features/permissions/actions/GroupAddPermission.vue";
import RemovePermission from "@/features/permissions/actions/RemovePermission.vue";
import { useGroup } from "../api/useGroup";

const route = useRoute();

const { members, permissions, query, group } = useGroup(
  route.params.id as string,
);
</script>
