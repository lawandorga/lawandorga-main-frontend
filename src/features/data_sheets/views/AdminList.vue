<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Templates', to: { name: 'admin-templates' } }]"
      >
        <CogIcon class="w-6 h-6" />
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

<script lang="ts" setup>
import { ref } from "vue";
import { RecordTemplate } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import useClient from "@/api/client";
import RecordsCreateTemplate from "@/features/data_sheets/actions/CreateTemplate.vue";
import RecordsUpdateTemplate from "@/features/data_sheets/actions/UpdateTemplate.vue";
import RecordsDeleteTemplate from "@/features/data_sheets/actions/DeleteTemplate.vue";

const client = useClient();

const list = client.get("api/data_sheets/query/templates/");

const templates = ref<RecordTemplate[]>();

const query = useGet(list, templates);
</script>
