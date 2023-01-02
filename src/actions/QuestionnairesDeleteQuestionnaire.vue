<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    :data="{ id: id }"
    :request="commandRequest"
    title="Delete Questionnaire"
    @deleted="emit('deleted')"
  />
</template>

<script setup lang="ts">
import RecordsService from "@/services/records";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";

const emit = defineEmits(["deleted"]);

const props = defineProps<{
  id?: number;
  query: () => void;
}>();

const { id, query } = toRefs(props);

const { commandModalOpen, commandRequest } = useCommand(
  RecordsService.deleteQuestionnaire,
  query.value,
);
</script>
