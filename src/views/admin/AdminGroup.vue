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
          { name: 'Permission', key: (obj) => obj.permission_object.name },
          { name: '', key: 'action' },
        ]"
        :data="permissions"
      >
        <template #head-action>
          <GroupsAddPermission :query="permissionsQuery" :group-id="group.id" />
        </template>
        <template #action="slotProps">
          <GroupsRemovePermission
            :query="permissionsQuery"
            :permission-name="slotProps.permission_object.name"
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
          <GroupsAddMember :group-id="group.id" :query="membersQuery" />
        </template>
        <template #action="slotProps">
          <GroupsRemoveMember
            :member-id="slotProps.id"
            :group-id="group.id"
            :query="membersQuery"
            :member-name="slotProps.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import { Ref, ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useGet from "@/composables/useGet";
import { Group, GroupMember, HasPermission } from "@/types/core";
import AdminService from "@/services/admin";
import { useRoute } from "vue-router";
import GroupsAddMember from "@/actions/GroupsAddMember.vue";
import GroupsRemoveMember from "@/actions/GroupsRemoveMember.vue";
import GroupsAddPermission from "@/actions/GroupsAddPermission.vue";
import GroupsRemovePermission from "@/actions/GroupsRemovePermission.vue";

const route = useRoute();

// group
const group = ref(null) as Ref<Group | null>;
useGet(AdminService.getGroup, group, route.params.id as string);

// members
const members = ref(null) as Ref<GroupMember[] | null>;
const membersQuery = useGet(AdminService.getMembers, members, group);

// permissions
const permissions = ref(null) as Ref<HasPermission[] | null>;
const permissionsQuery = useGet(
  AdminService.getGroupPermissions,
  permissions,
  group,
);
</script>
