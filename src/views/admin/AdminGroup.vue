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
import { computed, Ref, ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useGet from "@/composables/useGet";
import { GroupMember, IGroupDetail, IGroupPermission } from "@/types/core";
import { useRoute } from "vue-router";
import GroupsAddMember from "@/actions/GroupsAddMember.vue";
import GroupsRemoveMember from "@/actions/GroupsRemoveMember.vue";
import useClient from "@/api/client";
import GroupAddPermission from "@/features/permissions/actions/GroupAddPermission.vue";
import RemovePermission from "@/features/permissions/actions/RemovePermission.vue";

const route = useRoute();

const client = useClient();

const request = client.get("api/query/group/{}/", route.params.id as string);

const group = ref(null) as Ref<IGroupDetail | null>;
const query = useGet(request, group);

const members = computed<GroupMember[] | null>(() => {
  if (!group.value) return null;
  return group.value.members;
});

const permissions = computed<IGroupPermission[] | null>(() => {
  if (!group.value) return null;
  return group.value.permissions;
});
</script>
