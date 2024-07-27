<script setup lang="ts">
import {
  ButtonNormal,
  ModalFree,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
  TableTable,
} from "lorga-ui";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { ref, toRefs } from "vue";
import useCollabTemplates from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";
import { CollabTemplate } from "@/features/admin/api/useTemplate";
import TemplatePreview from "../components/TemplatePreview.vue";

const props = defineProps<{
  query: () => void;
  uuid: string;
  selectedTemplate: CollabTemplate | null;
}>();
const { query, selectedTemplate } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { templates } = useCollabTemplates();
const selectedTemplateId = ref<string>(selectedTemplate.value?.uuid ?? "");
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-6" @click="commandModalOpen = true">
    <ArrowPathIcon class="w-5 h-5 mr-2" />
    Change Template
  </ButtonNormal>
  <ModalFree
    v-model="commandModalOpen"
    title="Change Template"
    width="max-w-4xl"
  >
    <TableTable>
      <TableHead>
        <TableRow>
          <TableHeader><span class="ml-[27px]">Name</span></TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow v-for="template in templates" :key="template.uuid">
          <label :for="template.uuid" class="contents">
            <TableData>
              <input
                :id="template.uuid"
                v-model="selectedTemplateId"
                type="radio"
                :value="template.uuid"
                class="mr-2"
              />
              {{ template.name }}
            </TableData>
            <TableData>
              {{ template.description }}
            </TableData>
            <TableData>
              <TemplatePreview :data="{ template_uuid: template.uuid }" />
            </TableData>
          </label>
        </TableRow>
      </TableBody>
    </TableTable>
    <ButtonNormal
      class="flex justify-end mt-4"
      @click="
        () => {
          commandRequest({
            action: 'collab/assign_template_to_collab',
            collab_uuid: uuid,
            template_uuid: selectedTemplateId,
          });
        }
      "
    >
      Change template
    </ButtonNormal>
  </ModalFree>
</template>
