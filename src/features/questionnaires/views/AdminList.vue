<template>
  <BoxLoader :show="true">
    <div class="mx-auto max-w-2xl space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'questionnaires-admin-list' } },
        ]"
      >
        <CogIcon class="h-6 w-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'Note', key: 'notes' },
          { name: '', key: 'action' },
        ]"
        :data="templates"
      >
        <template #head-action>
          <TemplateCreate :query="query" />
        </template>
        <template #name="slotProps">
          <ButtonLink
            class="underline"
            :to="{
              name: 'questionnaires-admin-detail',
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <TemplateUpdate
            :query="query"
            :template-id="slotProps.id"
            :template-name="slotProps.name"
            :template-notes="slotProps.notes"
          />
          <TemplateDelete
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
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import { ref } from "vue";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import ButtonLink from "@/components/ButtonLink.vue";
import useGet2 from "@/composables/useGet2";
import TemplateCreate from "@/features/questionnaires/actions/CreateTemplate.vue";
import TemplateDelete from "@/features/questionnaires/actions/DeleteTemplate.vue";
import TemplateUpdate from "@/features/questionnaires/actions/UpdateTemplate.vue";

interface QuestionnaireTemplate {
  id: string;
  name: string;
  notes: string;
}

const templates = ref<QuestionnaireTemplate>();

const query = useGet2("api/questionnaires/query/templates/", templates);
</script>
