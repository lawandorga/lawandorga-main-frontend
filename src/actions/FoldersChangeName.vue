<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    {{ text }}
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change name"
      :fields="fields"
      :request="commandRequest"
      :data="{ uuid: folderUuid, name: folderName }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { foldersUpdateFolder } from "@/services/folders";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    folderName: string;
    folderUuid: string | null;
    query: () => void;
    text?: string;
  }>(),
  { text: "Change Name" },
);
const { query } = toRefs(props);

const fields: types.FormField[] = [
  { label: "Name", name: "name", type: "text", required: true },
];

const { commandRequest, commandModalOpen } = useCommand(
  foldersUpdateFolder,
  query.value,
);
</script>
