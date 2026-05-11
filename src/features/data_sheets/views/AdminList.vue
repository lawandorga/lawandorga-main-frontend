<script lang="ts" setup>
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import RecordsCreateTemplate from "@/features/data_sheets/actions/CreateTemplate.vue";
import RecordsDeleteTemplate from "@/features/data_sheets/actions/DeleteTemplate.vue";
import RecordsUpdateTemplate from "@/features/data_sheets/actions/UpdateTemplate.vue";

import { useTemplates } from "../api/useTemplates";

const { templates, query } = useTemplates();
query();
</script>

<template>
  <BoxLoader :show="true">
    <div class="mx-auto max-w-2xl space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Templates', to: { name: 'admin-templates' } }]"
      >
        <CogIcon class="h-6 w-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="templates"
      >
        <template #head-action>
          <RecordsCreateTemplate :query="query" />
        </template>
        <template #name="slotProps">
          <ButtonLink
            class="underline"
            :to="{
              name: 'admin-template',
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <RecordsUpdateTemplate
            :query="query"
            :template-id="slotProps.id"
            :template-name="slotProps.name"
            :template-show="slotProps.show"
          />
          <RecordsDeleteTemplate
            :query="query"
            :template-id="slotProps.id"
            :template-name="slotProps.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
