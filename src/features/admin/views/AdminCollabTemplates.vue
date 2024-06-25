<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollab from "../api/useCollabTemplates";
import { TableGenerator } from "lorga-ui";
import CreateCollabLetterhead from "../actions/CreateCollabLetterhead.vue";
import CreateCollabFooter from "../actions/CreateCollabFooter.vue";
import DeleteCollabLetterhead from "../actions/DeleteCollabLetterhead.vue";
import DeleteCollabFooter from "../actions/DeleteCollabFooter.vue";
import ButtonLink from "@/components/ButtonLink.vue";

const { templates, query } = useCollab();
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
    </BreadcrumbsBar>
    <CreateCollabLetterhead :query="query" class="mx-2" />
    <CreateCollabFooter :query="query" class="mx-2" />
    <TableGenerator
      :head="[
        { name: 'Name', key: 'name' },
        { name: 'Type', key: 'template_type' },
        { name: 'Description', key: 'description' },
        { name: '', key: 'action' },
      ]"
      :data="templates"
    >
      <template #name="{ i, v }">
        <ButtonLink
          v-if="i.template_type === 'letterhead'"
          :to="{
            name: 'admin-collab-letterhead',
            params: { uuid: i.uuid },
          }"
        >
          {{ v }}
        </ButtonLink>
        <ButtonLink
          v-if="i.template_type === 'footer'"
          :to="{
            name: 'admin-collab-footer',
            params: { uuid: i.uuid },
          }"
        >
          {{ v }}
        </ButtonLink>
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
