<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
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
  {
    label: "Column 1",
    name: "column_1",
    type: "text",
    required: false,
  },
  {
    label: "Column 2",
    name: "column_2",
    type: "text",
    required: false,
  },
  {
    label: "Column 3",
    name: "column_3",
    type: "text",
    required: false,
  },
  {
    label: "Column 4",
    name: "column_4",
    type: "text",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    <PlusCircleIcon class="w-6 h-6 mr-3" />
    Create Footer
    <ModalForm
      v-model="commandModalOpen"
      title="Create Footer"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="{ action: 'collab/create_footer' }"
    />
  </ButtonNormal>
</template>
