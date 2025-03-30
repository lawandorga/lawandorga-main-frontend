<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    {{ text }}
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change name"
      :fields="fields"
      :request="commandRequest"
      :data="{
        folder_uuid: folderUuid,
        name: folderName,
        action: 'folders/rename_folder',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
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

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
