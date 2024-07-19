<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    required: true,
  },
]);
</script>

<template>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    Create Template
    <ModalForm
      v-model="commandModalOpen"
      title="Create Template"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="{ action: 'collab/create_template' }"
    />
  </ButtonNormal>
</template>
