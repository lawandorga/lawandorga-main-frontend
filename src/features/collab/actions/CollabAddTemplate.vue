<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { computed, toRefs } from "vue";
import useCollab from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  uuid: string;
}>();
const { query, uuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { templates } = useCollab();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Letterhead",
    name: "letterhead_uuid",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "letterhead",
    ),
    required: false,
  },
  {
    label: "Footer",
    name: "footer_uuid",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "footer",
    ),
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-4" @click="commandModalOpen = true">
    <PlusCircleIcon class="w-5 h-5 mr-2" />
    Add Template
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    :fields="fields"
    submit="Apply template"
    :request="commandRequest"
    :data="{
      action: 'collab/update_collab_template',
      collab_uuid: uuid,
    }"
  />
</template>
