<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { computed, ref, toRefs } from "vue";
import useCollabTemplates from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";

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

const getPreviewLink = (data: Record<string, unknown>): string | undefined => {
  const templateUuid = data.template_uuid as string | undefined;
  if (!templateUuid) return undefined;
  return `${import.meta.env.VITE_BACKEND_URL}/api/collab/query/template/${templateUuid}/pdf/`;
};

const previewLink = ref<string | undefined>();
const updatePreview = (data: Record<string, unknown>) => {
  previewLink.value = getPreviewLink(data);
};
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
    @change="updatePreview"
  >
    <template #preview>
      <a
        v-if="previewLink"
        class="font-medium underline text-formcolor"
        target="_blank"
        :href="previewLink"
      >
        > Preview Template
      </a>
    </template>
  </ModalForm>
</template>
