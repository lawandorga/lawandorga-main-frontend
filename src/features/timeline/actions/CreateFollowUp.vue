<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Follow Up
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    :fields="fields"
    title="Create Follow Up"
    :request="commandRequest"
    :data="{ folder_uuid: folderUuid, action: 'timeline/create_follow_up' }"
    submit="Create"
  />
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{ query: () => void; folderUuid: string }>();
const { query, folderUuid } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Time",
    name: "time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "Text",
    name: "text",
    type: "textarea",
    required: true,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
