<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { computed, toRefs } from "vue";
import useCollabTemplates from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";
import { CollabTemplate } from "@/features/admin/api/useTemplate";

const props = defineProps<{
  query: () => void;
  uuid: string;
  selectedTemplate: CollabTemplate | null;
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
]);
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-6" @click="commandModalOpen = true">
    <ArrowPathIcon class="w-5 h-5 mr-2" />
    Change Template
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    title="Change Template"
    :fields="fields"
    submit="Change template"
    :request="commandRequest"
    :data="{
      action: 'collab/assign_template_to_collab',
      collab_uuid: uuid,
      template_uuid: selectedTemplate?.uuid,
    }"
  />
</template>
