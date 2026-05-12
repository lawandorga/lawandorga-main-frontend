<script lang="ts" setup>
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonLink from "@/components/ButtonLink.vue";

import CreateCollabTemplate from "../actions/CreateCollabTemplate.vue";
import DeleteCollabTemplate from "../actions/DeleteCollabTemplate.vue";
import useCollabTemplates from "../api/useCollabTemplates";

const { templates, query } = useCollabTemplates();
</script>

<template>
  <div class="mx-auto max-w-(--breakpoint-lg) space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
      ]"
    >
      <CogIcon class="h-6 w-6" />
      <template #buttons>
        <CreateCollabTemplate :query="query" />
      </template>
    </BreadcrumbsBar>
    <TableGenerator
      :head="[
        { name: 'Name', key: 'name' },
        { name: 'Description', key: 'description' },
        { name: '', key: 'action' },
      ]"
      :data="templates"
    >
      <template #name="{ v }">
        <div>
          {{ v }}
        </div>
      </template>
      <template #description="slotProps">
        <div class="line-clamp-1 text-ellipsis">
          {{ slotProps.description }}
        </div>
      </template>
      <template #action="slotProps">
        <ButtonLink
          :to="{
            name: 'admin-collab-edit-template',
            params: {
              uuid: slotProps.uuid,
            },
          }"
          class="text-sm no-underline"
        >
          {{ "Edit" }}
        </ButtonLink>
        <DeleteCollabTemplate
          :title="slotProps.name"
          :uuid="slotProps.uuid"
          :query="query"
        />
      </template>
    </TableGenerator>
  </div>
</template>

<style scoped>
:deep(table) {
  table-layout: fixed;
}
</style>
