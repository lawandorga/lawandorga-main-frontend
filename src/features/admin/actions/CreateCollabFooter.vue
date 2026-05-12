<script setup lang="ts">
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  uuid: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
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
    <PlusCircleIcon class="mr-3 h-6 w-6" />
    Create Footer
    <ModalForm
      v-model="commandModalOpen"
      title="Create Footer"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="{ action: 'collab/create_footer', template_uuid: uuid }"
    />
  </ButtonNormal>
</template>
