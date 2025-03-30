<template>
  <BoxLoader show>
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Groups',
            to: { name: 'admin-groups' },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Group', key: 'name' },
          { name: 'Description', key: 'description' },
          { name: 'Action', key: 'action' },
        ]"
        :data="groups"
      >
        <template #head-action>
          <GroupsCreateGroup :query="query" />
        </template>
        <template #name="slotProps">
          <ButtonLink
            :to="{ name: 'admin-group', params: { id: slotProps.id } }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <GroupsUpdateGroup
            :query="query"
            :group-id="slotProps.id"
            :group-name="slotProps.name"
            :group-description="slotProps.description"
          />
          <GroupsDeleteGroup
            :query="query"
            :group-id="slotProps.id"
            :group-name="slotProps.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import GroupsCreateGroup from "@/features/org/actions/CreateGroup.vue";
import GroupsUpdateGroup from "@/features/org/actions/UpdateGroup.vue";
import GroupsDeleteGroup from "@/features/org/actions/DeleteGroup.vue";
import { useGroups } from "../api/useGroups";

const { query, groups } = useGroups();
</script>
