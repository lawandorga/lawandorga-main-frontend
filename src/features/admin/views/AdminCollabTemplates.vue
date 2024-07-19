<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollabTemplates from "../api/useCollabTemplates";
import { TableGenerator } from "lorga-ui";
// import CreateCollabLetterhead from "../actions/CreateCollabLetterhead.vue";
// import CreateCollabFooter from "../actions/CreateCollabFooter.vue";
import CreateCollabTemplate from "../actions/CreateCollabTemplate.vue";
import DeleteCollabLetterhead from "../actions/DeleteCollabLetterhead.vue";
import DeleteCollabFooter from "../actions/DeleteCollabFooter.vue";
import ButtonLink from "@/components/ButtonLink.vue";

const { templates, query } = useCollabTemplates();
</script>

<template>
  <div class="max-w-screen-lg mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[
        { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
      ]"
    >
      <CogIcon class="w-6 h-6" />
      <template #buttons>
        <!--<CreateCollabLetterhead :query="query" />
        <CreateCollabFooter :query="query" /> -->
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
        <div class="text-[color:var(--lorgablue)] font-semibold">
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
          v-if="slotProps.template_type === 'letterhead'"
          :to="{
            name: 'admin-collab-letterhead',
            params: { uuid: slotProps.uuid },
          }"
          class="text-sm no-underline"
        >
          {{ "Edit" }}
        </ButtonLink>
        <DeleteCollabLetterhead
          v-if="slotProps.template_type === 'letterhead'"
          :title="slotProps.name"
          :uuid="slotProps.uuid"
          :query="query"
        />

        <ButtonLink
          v-if="slotProps.template_type === 'footer'"
          :to="{
            name: 'admin-collab-footer',
            params: { uuid: slotProps.uuid },
          }"
          class="text-sm no-underline"
        >
          {{ "Edit" }}
        </ButtonLink>
        <DeleteCollabFooter
          v-if="slotProps.template_type === 'footer'"
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
