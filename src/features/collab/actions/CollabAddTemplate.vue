<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { computed, toRefs } from "vue";
import useCollabTemplates from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";
import TemplatePreview from "../components/TemplatePreview.vue";

const props = defineProps<{
  query: () => void;
  uuid: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { templates } = useCollabTemplates();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Template",
    name: "template_uuid",
    type: "select",
    options: templates.value,
    required: false,
  },
  {
    name: "preview",
    type: "slot",
  },
]);
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-6" @click="commandModalOpen = true">
    <PlusCircleIcon class="w-5 h-5 mr-2" />
    Add Template
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    title="Add Template"
    :fields="fields"
    submit="Add template"
    :request="commandRequest"
    :data="{
      action: 'collab/assign_template_to_collab',
      collab_uuid: uuid,
    }"
  >
    <template #preview="{ data }">
      <TemplatePreview :data="data" />
    </template>
  </ModalForm>
</template>
