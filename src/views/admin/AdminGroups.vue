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
import { Group } from "@/types/core";
import { Ref, ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import useClient from "@/api/client";
import GroupsCreateGroup from "@/actions/GroupsCreateGroup.vue";
import GroupsUpdateGroup from "@/actions/GroupsUpdateGroup.vue";
import GroupsDeleteGroup from "@/actions/GroupsDeleteGroup.vue";

const groups = ref(null) as Ref<Group[] | null>;

const client = useClient();
const request = client.get("api/query/groups/");

const query = useGet(request, groups);
</script>
