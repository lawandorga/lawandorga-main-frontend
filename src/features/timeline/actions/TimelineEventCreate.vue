<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Timeline Event
  </ButtonNormal>
  <ModalCreate
    v-model="commandModalOpen"
    :fields="fields"
    title="Create Timeline Event"
    :request="commandRequest"
    :data="{ folder_uuid: folderUuid }"
    submit="Create"
  />
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

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

const client = useClient();
const request = client.post("api/timeline/timeline/");
const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
