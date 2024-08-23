<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Template
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Template"
      :fields="createFields"
      :request="commandRequest"
      :data="{
        action: 'data_sheets/create_template',
      }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const createFields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
