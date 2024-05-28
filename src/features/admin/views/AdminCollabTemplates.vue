<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollab from "../../records/api/useCollab";
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
        { name: 'Description', key: 'description' },
        { name: 'Options', key: 'options' },
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
      <template #options="slotProps">
        <ButtonLink
          v-if="slotProps.template_type === 'letterhead'"
          :to="{
            name: 'admin-collab-letterhead',
            params: { uuid: slotProps.uuid },
          }"
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
    <!-- <table
      class="w-full text-base text-left bg-white border border-collapse border-gray-300 rounded-md table-fixed drop-shadow-sm"
    >
      <thead class="h-16 bg-gray-50 text-zinc-700">
        <tr>
          <th
            scope="col"
            class="px-10 text-lg font-semibold border border-gray-300"
          >
            Name
          </th>
          <th scope="col" class="font-semibold border border-gray-300 px-9">
            Description
          </th>
          <th scope="col" class="font-semibold border border-gray-300 px-9">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="template in templates"
          :key="template.uuid"
          class="h-14 text-formcolor"
        >
          <td class="px-10 font-semibold border border-gray-300">
            {{ template.name }}
          </td>
          <td class="font-medium border border-gray-300 px-9">
            <span class="line-clamp-2">
              {{ template.description }}
            </span>
          </td>
          <td class="gap-6 border border-gray-300 px-9">
            <ButtonNormal kind="action" class="mr-6">Edit</ButtonNormal>
            <DeleteCollabTemplate
              v-if="template.template_type === 'letterhead'"
              :title="template.name"
              :type="template.template_type"
              :uuid="template.uuid"
            />
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>
