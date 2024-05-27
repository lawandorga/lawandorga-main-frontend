<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollab from "../../records/api/useCollab";
import { ButtonNormal, ModalCreate } from "lorga-ui";
import DeleteCollabTemplate from "../actions/DeleteCollabTemplate.vue";
import CreateCollabLetterhead from "../actions/CreateCollabLetterhead.vue";

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
    <CreateCollabLetterhead :query="query" />
    <table
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
          <!-- TODO: make the title a button to edit the template -->
          <td class="px-10 font-semibold border border-gray-300">
            {{ template.name }}
          </td>
          <td class="font-medium border border-gray-300 px-9">
            <span class="line-clamp-2">
              {{ template.description }}
            </span>
          </td>
          <td class="gap-6 border border-gray-300 px-9">
            <!-- TODO: @click -->
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
    </table>
  </div>
</template>
