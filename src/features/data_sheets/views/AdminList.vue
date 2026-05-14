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
        <template #buttons>
          <RecordsCreateTemplate />
        </template>
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="templates"
      >
        <template #name="{ id, name }">
          <ButtonLink
            class="underline"
            :to="{
              name: 'admin-template',
              params: { id },
            }"
          >
            {{ name }}
          </ButtonLink>
        </template>
        <template #action="{ id, name, show }">
          <RecordsUpdateTemplate
            :query="query"
            :template-id="id"
            :template-name="name"
            :template-show="show"
          />
          <RecordsDeleteTemplate
            :query="query"
            :template-id="id"
            :template-name="name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>
