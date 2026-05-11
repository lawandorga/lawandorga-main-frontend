<template>
  <BoxLoader :show="!!template">
    <div v-if="template" class="mx-auto max-w-2xl space-y-6">
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
        <CogIcon class="h-6 w-6" />
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
import { CogIcon } from "@heroicons/vue/24/outline";
import { TableGenerator } from "lorga-ui";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet2 from "@/composables/useGet2";

import TemplateFieldCreate from "../actions/CreateTemplateField.vue";
import TemplateFileCreate from "../actions/CreateTemplateFile.vue";
import TemplateFieldDelete from "../actions/DeleteTemplateField.vue";
import TemplateFileDelete from "../actions/DeleteTemplateFile.vue";
import TemplateFileDownload from "../actions/DownloadTemplateFile.vue";
import TemplateFieldUpdate from "../actions/UpdateTemplateField.vue";

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
