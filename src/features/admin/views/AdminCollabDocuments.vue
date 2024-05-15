<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollab from "../../records/api/useCollab";
import { ref } from "vue";
import { ButtonNormal } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import CollabDelete from "@/features/collab/actions/CollabDelete.vue";

const { getTemplates } = useCollab();
const templates = ref(getTemplates());
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
      <template #buttons>
        <!-- TODO: @click -->
        <ButtonNormal>
          <PlusCircleIcon class="w-6 h-6 pr-2" />
          New template
        </ButtonNormal>
      </template>
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <table
      class="w-full text-base text-left bg-white border border-collapse border-gray-300 rounded-md table-fixed drop-shadow-sm"
    >
      <thead class="h-16 bg-gray-50 text-zinc-700">
        <tr>
          <th
            scope="col"
            class="px-10 text-lg font-semibold border border-gray-300"
          >
            Title
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
            {{ template.title }}
          </td>
          <td class="font-medium border border-gray-300 px-9">
            {{ template.description }}
          </td>
          <td class="gap-6 border border-gray-300 px-9">
            <!-- TODO: @click -->
            <ButtonNormal kind="action" class="mr-6">Edit</ButtonNormal>
            <CollabDelete
              :title="template.title"
              :type="template.type"
              :uuid="template.uuid"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
