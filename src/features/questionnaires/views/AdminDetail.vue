<template>
  <BoxLoader :show="!!template">
    <div v-if="template" class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'questionnaires-admin-list' } },
          {
            name: template.name,
            to: {
              name: 'questionnaires-admin-detail',
              params: { id: template.id.toString() },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Question', key: 'question' },
          { name: 'Type', key: 'type' },
          { name: 'Order', key: 'order' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <TemplateFieldCreate :query="query" :template-id="template.id" />
        </template>
        <template #action="slotProps">
          <TemplateFieldUpdate
            :query="query"
            :template-field-id="slotProps.id"
            :template-field-name="slotProps.name"
            :template-field-question="slotProps.question"
            :template-field-type="slotProps.type"
            :template-field-order="slotProps.order"
          />
          <TemplateFieldDelete
            :query="query"
            :template-field-id="slotProps.id"
            :template-field-name="slotProps.name"
          />
        </template>
      </TableGenerator>
      <TableGenerator
        :head="[
          { name: 'File', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="files"
      >
        <template #head-action>
          <TemplateFileCreate :query="query" :template-id="template.id" />
        </template>
        <template #action="slotProps">
          <TemplateFileDownload
            :template-file-id="slotProps.id"
            :file-name="slotProps.name"
          />
          <TemplateFileDelete
            :query="query"
            :template-file-id="slotProps.id"
            :template-file-name="slotProps.name"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import useGet2 from "@/composables/useGet2";
import TemplateFileDelete from "../actions/TemplateFileDelete.vue";
import TemplateFileCreate from "../actions/TemplateFileCreate.vue";
import TemplateFieldUpdate from "../actions/TemplateFieldUpdate.vue";
import TemplateFieldDelete from "../actions/TemplateFieldDelete.vue";
import TemplateFieldCreate from "../actions/TemplateFieldCreate.vue";
import TemplateFileDownload from "../actions/TemplateFileDownload.vue";

interface TextField {
  id: number;
  name: string;
  order: number;
  question: string;
  type: string;
}

interface FileField {
  id: number;
  name: string;
}

interface Template {
  id: number;
  name: string;
  notes: string;
  fields: TextField[];
  files: FileField[];
}

const route = useRoute();

const template = ref<Template>();
const query = useGet2(
  `api/questionnaires/query/template/${route.params.id}/`,
  template,
);

const fields = computed<TextField[] | undefined>(() => template.value?.fields);

const files = computed<FileField[] | undefined>(() => template.value?.files);
</script>
