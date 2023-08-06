<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Timeline Event"
    :request="commandRequest"
    :data="{ folder_uuid: folderUuid, name: name, uuid: timelineEventUuid }"
    submit="Delete"
  />
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  timelineEventUuid: string;
  name: string;
}>();
const { query, folderUuid } = toRefs(props);

const client = useClient();
const request = client.post("api/timeline/timeline/delete/");
const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
