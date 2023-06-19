<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'admin-questionnaires' } },
        ]"
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
          <QuestionnaireCreate :query="query" />
        </template>
        <template #name="slotProps">
          <ButtonLink
            class="underline"
            :to="{
              name: 'admin-questionnaire',
              params: { id: slotProps.id },
            }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <QuestionnaireUpdate
            :query="query"
            :template-id="slotProps.id"
            :template-name="slotProps.name"
            :template-notes="slotProps.notes"
          />
          <QuestionnaireDelete
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
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import QuestionnaireCreate from "@/features/questionnaires/actions/QuestionnaireCreate.vue";
import QuestionnaireUpdate from "@/features/questionnaires/actions/QuestionnaireUpdate.vue";
import QuestionnaireDelete from "@/features/questionnaires/actions/QuestionnaireDelete.vue";
import useClient from "@/api/client";

interface IQuestionnaireTemplate {
  id: string;
  name: string;
  notes: string;
}

const templates = ref(null) as Ref<IQuestionnaireTemplate[] | null>;

const request = useClient().get("api/questionnaires/questionnairetemplates/");
const query = useGet(request, templates);
</script>
