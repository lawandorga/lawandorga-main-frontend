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
import { Ref, ref } from "vue";
import { RecordTemplate } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import useClient from "@/api/client";
import RecordsCreateTemplate from "@/actions/RecordsCreateTemplate.vue";
import RecordsUpdateTemplate from "@/actions/RecordsUpdateTemplate.vue";
import RecordsDeleteTemplate from "@/actions/RecordsDeleteTemplate.vue";

const client = useClient();

const list = client.get("api/records/query/templates/");

const templates = ref(null) as Ref<RecordTemplate[] | null>;

const query = useGet(list, templates);
</script>
