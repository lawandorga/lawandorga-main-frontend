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
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{
  id?: number;
  query: () => void;
}>();
const { id, query } = toRefs(props);

const emit = defineEmits(["deleted"]);

const client = useClient();
const request = client.delete("api/questionnaires/questionnaires/{id}/");

const { commandModalOpen, commandRequest } = useCommand(request, query.value);
</script>
