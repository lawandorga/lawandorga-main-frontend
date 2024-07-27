<script lang="ts" setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import useCollabTemplates from "../api/useCollabTemplates";
import { TableGenerator } from "lorga-ui";
import CreateCollabTemplate from "../actions/CreateCollabTemplate.vue";
import DeleteCollabTemplate from "../actions/DeleteCollabTemplate.vue";
import ButtonLink from "@/components/ButtonLink.vue";
// import { watch } from "vue";
// import { useRouter } from "vue-router";

const { templates, query } = useCollabTemplates();

// const router = useRouter();

// watch(templates, (newTemplates, oldTemplates) => {
//   if (newTemplates.length === oldTemplates.length + 1) {
//     const newTemplateUuids = newTemplates.map((template) => template.uuid);
//     const oldTemplateUuids = oldTemplates.map((template) => template.uuid);
//     const newTemplateUuid = newTemplateUuids.find(
//       (uuid) => !oldTemplateUuids.includes(uuid),
//     );

//     router.push({
//       name: "admin-collab-edit-template",
//       params: {
//         uuid: newTemplateUuid,
//       },
//     });
//   }
// });
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
