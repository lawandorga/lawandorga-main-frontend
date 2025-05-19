<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Folder
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Folder"
      :fields="fields"
      :request="commandRequest"
      :data="{ parent: null, action: 'folders/create_folder' }"
    />
  </ButtonNormal>
</template>
