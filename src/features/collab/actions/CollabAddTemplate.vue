<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import useCollab from "@/features/admin/api/useCollabTemplates";

const modalOpen = ref(false);

const { templates } = useCollab();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Letterhead",
    name: "letterhead",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "letterhead",
    ),
    required: false,
  },
  {
    label: "Footer",
    name: "footer",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "footer",
    ),
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-4" @click="modalOpen = true">
    <PlusCircleIcon class="w-5 h-5 mr-2" />
    Add Template
  </ButtonNormal>
  <ModalForm v-model="modalOpen" :fields="fields" />
</template>
