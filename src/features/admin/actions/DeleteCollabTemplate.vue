<script setup lang="ts">
import { TemplateType } from "@/features/records/api/useCollab";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { ref } from "vue";

defineProps<{
  title: string;
  type: TemplateType;
  uuid: string; // TODO: string or number?
}>();

const modalOpen = ref(false);

// TODO: Add deleting function from backend, depending on which type of template it is
</script>

<template>
  <ButtonNormal kind="delete" @click="modalOpen = true">
    Delete
    <ModalDelete
      v-model="modalOpen"
      title="Delete Document Template"
      :obj-name="title"
    />
  </ButtonNormal>
</template>
